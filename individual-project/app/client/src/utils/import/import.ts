import type { OutputData } from "@/components/editors/editorjs-editor";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Disable worker to avoid CDN issues - use main thread instead
// This is slower but more reliable and doesn't require external resources
if (typeof window !== "undefined") {
  // Set to empty string to disable worker and use main thread
  pdfjsLib.GlobalWorkerOptions.workerSrc = "";
}

/**
 * Parse PDF file and convert to EditorJS format
 * @param file - PDF file to parse
 * @returns EditorJS OutputData
 */
export async function parsePDFToEditorJS(file: File): Promise<OutputData> {
  try {
    // Ensure worker is disabled (using main thread)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "";

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      verbosity: 0, // Suppress console warnings
      useWorkerFetch: false, // Disable worker fetch
      isEvalSupported: false, // Disable eval
    });
    const pdf = await loadingTask.promise;
    const blocks: OutputData["blocks"] = [];

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      let currentParagraph = "";
      const PARAGRAPH_MAX_LENGTH = 500;
      
      for (const item of textContent.items) {
        // Type guard for TextItem
        if ("str" in item && item.str) {
          currentParagraph += item.str + " ";
          
          // Create block on newline or if paragraph gets too long
          if (item.hasEOL || currentParagraph.length > PARAGRAPH_MAX_LENGTH) {
            const trimmed = currentParagraph.trim();
            if (trimmed) {
              blocks.push({
                type: "paragraph",
                data: { text: trimmed },
              });
              currentParagraph = "";
            }
          }
        }
      }

      // Add remaining paragraph
      const remaining = currentParagraph.trim();
      if (remaining) {
        blocks.push({
          type: "paragraph",
          data: { text: remaining },
        });
      }

      // Add page break separator between pages
      if (pageNum < pdf.numPages) {
        blocks.push({
          type: "paragraph",
          data: { text: "---" },
        });
      }
    }

    return { blocks, time: Date.now(), version: "2.31.0" };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse PDF file: ${errorMessage}`);
  }
}

/**
 * Parse DOCX file and convert to EditorJS format
 */
export async function parseDOCXToEditorJS(file: File): Promise<OutputData> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ 
      arrayBuffer,
    });
    const text = result.value;

    // Split text into paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

    const blocks: OutputData["blocks"] = paragraphs.map((paragraph) => {
      const trimmed = paragraph.trim();

      // Check if it's a heading (starts with #)
      if (trimmed.match(/^#{1,6}\s/)) {
        const match = trimmed.match(/^(#{1,6})\s(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          return {
            type: "header",
            data: {
              text: text,
              level: level,
            },
          };
        }
      }

      // Check if it's a list item
      if (trimmed.match(/^[-*+]\s/)) {
        const items = trimmed
          .split(/\n/)
          .filter((line) => line.trim().match(/^[-*+]\s/))
          .map((line) => line.replace(/^[-*+]\s/, "").trim());
        
        if (items.length > 0) {
          return {
            type: "list",
            data: {
              style: "unordered",
              items: items,
            },
          };
        }
      }

      // Check if it's an ordered list
      if (trimmed.match(/^\d+\.\s/)) {
        const items = trimmed
          .split(/\n/)
          .filter((line) => line.trim().match(/^\d+\.\s/))
          .map((line) => line.replace(/^\d+\.\s/, "").trim());
        
        if (items.length > 0) {
          return {
            type: "list",
            data: {
              style: "ordered",
              items: items,
            },
          };
        }
      }

      // Default to paragraph
      return {
        type: "paragraph",
        data: {
          text: trimmed,
        },
      };
    });

    return { blocks, time: Date.now(), version: "2.31.0" };
  } catch (error) {
    console.error("Error parsing DOCX:", error);
    throw new Error("Failed to parse DOCX file");
  }
}

/**
 * Parse Markdown/README file and convert to EditorJS format
 */
export async function parseMarkdownToEditorJS(file: File): Promise<OutputData> {
  try {
    const text = await file.text();
    const lines = text.split("\n");
    const blocks: OutputData["blocks"] = [];
    let currentParagraph: string[] = [];
    let currentList: string[] = [];
    let listStyle: "ordered" | "unordered" = "unordered";
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = "";

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const text = currentParagraph.join(" ").trim();
        if (text) {
          blocks.push({
            type: "paragraph",
            data: { text },
          });
        }
        currentParagraph = [];
      }
    };

    const flushList = () => {
      if (currentList.length > 0) {
        blocks.push({
          type: "list",
          data: {
            style: listStyle,
            items: currentList,
          },
        });
        currentList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        blocks.push({
          type: "code",
          data: {
            code: codeBlockContent.join("\n"),
            language: codeBlockLanguage || "plaintext",
          },
        });
        codeBlockContent = [];
        codeBlockLanguage = "";
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      // Check for code blocks
      if (trimmed.startsWith("```")) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushParagraph();
          flushList();
          codeBlockLanguage = trimmed.slice(3).trim();
          inCodeBlock = true;
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Check for headers
      if (trimmed.match(/^#{1,6}\s/)) {
        flushParagraph();
        flushList();
        const match = trimmed.match(/^(#{1,6})\s(.+)$/);
        if (match) {
          const level = match[1].length;
          const text = match[2];
          blocks.push({
            type: "header",
            data: { text, level },
          });
        }
        continue;
      }

      // Check for horizontal rule
      if (trimmed.match(/^[-*_]{3,}$/)) {
        flushParagraph();
        flushList();
        continue;
      }

      // Check for list items
      if (trimmed.match(/^[-*+]\s/)) {
        flushParagraph();
        if (listStyle !== "unordered") {
          flushList();
          listStyle = "unordered";
        }
        currentList.push(trimmed.replace(/^[-*+]\s/, ""));
        continue;
      }

      if (trimmed.match(/^\d+\.\s/)) {
        flushParagraph();
        if (listStyle !== "ordered") {
          flushList();
          listStyle = "ordered";
        }
        currentList.push(trimmed.replace(/^\d+\.\s/, ""));
        continue;
      }

      // Check for blockquote
      if (trimmed.startsWith(">")) {
        flushParagraph();
        flushList();
        const quoteText = trimmed.slice(1).trim();
        blocks.push({
          type: "quote",
          data: {
            text: quoteText,
            caption: "",
          },
        });
        continue;
      }

      // Empty line
      if (trimmed === "") {
        flushParagraph();
        flushList();
        continue;
      }

      // Regular paragraph text
      currentParagraph.push(trimmed);
    }

    // Flush remaining content
    flushParagraph();
    flushList();
    flushCodeBlock();

    return { blocks, time: Date.now(), version: "2.31.0" };
  } catch (error) {
    console.error("Error parsing Markdown:", error);
    throw new Error("Failed to parse Markdown file");
  }
}

/**
 * Parse text file and convert to EditorJS format
 */
export async function parseTextToEditorJS(file: File): Promise<OutputData> {
  try {
    const text = await file.text();
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim());

    const blocks: OutputData["blocks"] = paragraphs.map((paragraph) => ({
      type: "paragraph",
      data: {
        text: paragraph.trim(),
      },
    }));

    return { blocks, time: Date.now(), version: "2.31.0" };
  } catch (error) {
    console.error("Error parsing text file:", error);
    throw new Error("Failed to parse text file");
  }
}

/**
 * Import file based on its type
 */
export async function importFileToEditorJS(file: File): Promise<OutputData> {
  try {
    const extension = file.name.split(".").pop()?.toLowerCase();
    const mimeType = file.type;

    // PDF files
    if (extension === "pdf" || mimeType === "application/pdf") {
      return await parsePDFToEditorJS(file);
    }

    // DOCX files
    if (
      extension === "docx" ||
      extension === "doc" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/msword"
    ) {
      return await parseDOCXToEditorJS(file);
    }

    // Markdown files
    if (
      extension === "md" ||
      extension === "markdown" ||
      file.name.toLowerCase() === "readme.md" ||
      file.name.toLowerCase().endsWith(".readme") ||
      mimeType === "text/markdown" ||
      mimeType === "text/x-markdown"
    ) {
      return await parseMarkdownToEditorJS(file);
    }

    // Plain text files
    if (
      extension === "txt" ||
      mimeType === "text/plain" ||
      mimeType.startsWith("text/")
    ) {
      return await parseTextToEditorJS(file);
    }

    throw new Error(`Unsupported file type: ${extension || mimeType || "unknown"}. Supported formats: PDF, DOCX, Markdown, TXT`);
  } catch (error) {
    console.error("Import error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Failed to import file: ${String(error)}`);
  }
}

