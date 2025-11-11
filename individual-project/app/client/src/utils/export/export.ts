import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Packer } from "docx";
import type { OutputData } from "@/components/editors/editorjs-editor";

/**
 * Parse EditorJS content safely
 */
function parseContent(content: OutputData | string): OutputData["blocks"] {
  if (typeof content === "string") {
    if (!content.trim()) {
      return [];
    }
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed?.blocks) ? parsed.blocks : [];
    } catch {
      throw new Error("Invalid content format: Unable to parse JSON");
    }
  }
  return Array.isArray(content?.blocks) ? content.blocks : [];
}

// Cache for HTML escape to avoid creating DOM elements repeatedly
let escapeDiv: HTMLDivElement | null = null;

/**
 * Escape HTML special characters (optimized with caching)
 */
function escapeHtml(text: string): string {
  if (!escapeDiv) {
    escapeDiv = document.createElement("div");
  }
  escapeDiv.textContent = text;
  return escapeDiv.innerHTML;
}

/**
 * Parse inline formatting from EditorJS paragraph text
 */
function parseInlineFormatting(text: string): string {
  // Handle bold (**text**)
  text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Handle italic (*text*)
  text = text.replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  // Handle underline (__text__)
  text = text.replace(/__(.*?)__/g, "<u>$1</u>");
  // Handle marker/highlight (~~text~~)
  text = text.replace(/~~(.*?)~~/g, "<mark>$1</mark>");
  return text;
}

/**
 * Convert EditorJS blocks to HTML string with styles
 */
function editorJSToHTML(blocks: OutputData["blocks"]): string {
  if (!blocks || blocks.length === 0) {
    return '<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;"><p>No content</p></div>';
  }

  const htmlParts: string[] = ['<div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6;">'];

  blocks.forEach((block) => {
    if (!block || !block.type) return;

    switch (block.type) {
      case "header": {
        const level = Math.min(Math.max(block.data?.level || 1, 1), 6);
        const text = block.data?.text || "";
        if (text) {
          htmlParts.push(`<h${level} style="font-weight: bold; margin-top: 1em; margin-bottom: 0.5em;">${escapeHtml(text)}</h${level}>`);
        }
        break;
      }
      case "paragraph": {
        const text = block.data?.text || "";
        if (text) {
          const formattedText = parseInlineFormatting(text);
          htmlParts.push(`<p style="margin: 0.5em 0;">${formattedText}</p>`);
        }
        break;
      }
      case "list": {
        const style = block.data?.style || "unordered";
        const items = Array.isArray(block.data?.items) ? block.data.items : [];
        if (items.length > 0) {
          const tag = style === "ordered" ? "ol" : "ul";
          htmlParts.push(`<${tag} style="margin: 0.5em 0; padding-left: 2em;">`);
          items.forEach((item: string) => {
            if (item) {
              htmlParts.push(`<li style="margin: 0.25em 0;">${escapeHtml(String(item))}</li>`);
            }
          });
          htmlParts.push(`</${tag}>`);
        }
        break;
      }
      case "quote": {
        const text = block.data?.text || "";
        const caption = block.data?.caption || "";
        if (text) {
          htmlParts.push(`<blockquote style="border-left: 4px solid #3b82f6; padding-left: 1em; margin: 1em 0; font-style: italic; color: #4b5563;">`);
          htmlParts.push(`<p style="margin: 0.5em 0;">${escapeHtml(text)}</p>`);
          if (caption) {
            htmlParts.push(`<cite style="display: block; margin-top: 0.5em; font-size: 0.9em; color: #6b7280;">— ${escapeHtml(caption)}</cite>`);
          }
          htmlParts.push(`</blockquote>`);
        }
        break;
      }
      case "code": {
        const code = block.data?.code || "";
        if (code) {
          htmlParts.push(`<pre style="background-color: #f3f4f6; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0; font-family: 'Courier New', monospace; font-size: 0.9em; white-space: pre-wrap; word-wrap: break-word;"><code>${escapeHtml(String(code))}</code></pre>`);
        }
        break;
      }
      case "linkTool": {
        const link = block.data?.link || "";
        const meta = block.data?.meta || {};
        if (link) {
          htmlParts.push(`<div style="border: 1px solid #e5e7eb; border-radius: 4px; padding: 1em; margin: 1em 0;">`);
          if (meta.title) {
            htmlParts.push(`<h4 style="margin: 0 0 0.5em 0; font-weight: bold;">${escapeHtml(String(meta.title))}</h4>`);
          }
          if (meta.description) {
            htmlParts.push(`<p style="margin: 0 0 0.5em 0; color: #6b7280; font-size: 0.9em;">${escapeHtml(String(meta.description))}</p>`);
          }
          htmlParts.push(`<a href="${escapeHtml(link)}" style="color: #3b82f6; text-decoration: none; font-size: 0.85em;">${escapeHtml(link)}</a>`);
          htmlParts.push(`</div>`);
        }
        break;
      }
      default:
        // Unknown block type, try to render as text
        if (block.data?.text) {
          htmlParts.push(`<p style="margin: 0.5em 0;">${escapeHtml(String(block.data.text))}</p>`);
        }
    }
  });

  htmlParts.push("</div>");
  return htmlParts.join("");
}

/**
 * Export whiteboard canvas to PDF
 */
export async function exportWhiteboardToPDF(
  canvasElement: HTMLElement | string,
  filename: string = "whiteboard.pdf"
): Promise<void> {
  try {
    const element = typeof canvasElement === "string" 
      ? document.querySelector(canvasElement) as HTMLElement
      : canvasElement;

    if (!element) {
      throw new Error("Canvas element not found");
    }

    // Wait a bit for any animations or rendering to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Capture the canvas as an image
    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Calculate PDF dimensions (A4: 210mm x 297mm)
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const mmPerPixel = 0.264583; // 1px = 0.264583mm at 96dpi
    const pdfWidth = imgWidth * mmPerPixel;
    const pdfHeight = imgHeight * mmPerPixel;
    
    // Use A4 if content is smaller, otherwise use custom size
    const maxA4Width = 210;
    const maxA4Height = 297;
    const orientation = pdfWidth > pdfHeight ? "landscape" : "portrait";
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    
    // If content is larger than A4, scale it down
    if (pdfWidth > maxA4Width || pdfHeight > maxA4Height) {
      const scaleX = maxA4Width / pdfWidth;
      const scaleY = maxA4Height / pdfHeight;
      const scale = Math.min(scaleX, scaleY);
      finalWidth = pdfWidth * scale;
      finalHeight = pdfHeight * scale;
    }
    
    const pdf = new jsPDF({
      orientation: orientation as "landscape" | "portrait",
      unit: "mm",
      format: finalWidth <= maxA4Width && finalHeight <= maxA4Height 
        ? "a4" 
        : [finalWidth, finalHeight],
    });

    // Add image to PDF
    const imgData = canvas.toDataURL("image/png", 0.95);
    pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight, undefined, "FAST");

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting whiteboard to PDF:", error);
    throw new Error(`Failed to export whiteboard: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Export document (EditorJS content) to PDF
 */
export async function exportDocumentToPDF(
  content: OutputData | string,
  title: string = "Document",
  filename: string = "document.pdf"
): Promise<void> {
  try {
    const blocks = parseContent(content);
    
    if (blocks.length === 0) {
      throw new Error("Document has no content to export");
    }

    // Convert to HTML
    const html = editorJSToHTML(blocks);

    // Create an isolated iframe to avoid oklch color issues
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "800px";
    iframe.style.height = "600px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    // Wait for iframe to load
    await new Promise((resolve) => {
      if (iframe.contentDocument) {
        resolve(undefined);
      } else {
        iframe.onload = () => resolve(undefined);
      }
    });

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error("Failed to access iframe document");
    }

    // Extract inner HTML content (remove wrapper div)
    const tempWrapper = document.createElement("div");
    tempWrapper.innerHTML = html;
    const innerHTML = tempWrapper.firstElementChild?.innerHTML || html.replace(/^<div[^>]*>/, "").replace(/<\/div>$/s, "");

    // Write HTML with inline styles to avoid any CSS variable issues
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              color: #000000;
              background-color: #ffffff;
              padding: 20px;
              line-height: 1.6;
            }
            h1, h2, h3, h4, h5, h6 {
              font-weight: bold;
              margin-top: 1em;
              margin-bottom: 0.5em;
              color: #000000;
            }
            p {
              margin: 0.5em 0;
              color: #000000;
            }
            ul, ol {
              margin: 0.5em 0;
              padding-left: 2em;
              color: #000000;
            }
            li {
              margin: 0.25em 0;
              color: #000000;
            }
            blockquote {
              border-left: 4px solid #3b82f6;
              padding-left: 1em;
              margin: 1em 0;
              font-style: italic;
              color: #4b5563;
            }
            pre {
              background-color: #f3f4f6;
              padding: 1em;
              border-radius: 4px;
              overflow-x: auto;
              margin: 1em 0;
              font-family: 'Courier New', monospace;
              font-size: 0.9em;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            code {
              font-family: 'Courier New', monospace;
            }
            strong {
              font-weight: bold;
            }
            em {
              font-style: italic;
            }
            u {
              text-decoration: underline;
            }
            mark {
              background-color: #fef08a;
            }
          </style>
        </head>
        <body>
          ${innerHTML}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Wait for content to render
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Capture as image from iframe body
    const iframeBody = iframeDoc.body;
    if (!iframeBody) {
      throw new Error("Iframe body not found");
    }

    const canvas = await html2canvas(iframeBody, {
      backgroundColor: "#ffffff",
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: iframeBody.scrollWidth,
      windowHeight: iframeBody.scrollHeight,
    });

    // Clean up
    document.body.removeChild(iframe);

    // Create PDF with A4 format
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    const contentHeight = pageHeight - (margin * 2);

    // Add title
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    const titleLines = pdf.splitTextToSize(title, contentWidth);
    pdf.text(titleLines, margin, margin + 10);

    // Calculate image dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgAspectRatio = imgWidth / imgHeight;
    const pdfContentWidth = contentWidth;
    const pdfContentHeight = pdfContentWidth / imgAspectRatio;

    // Handle multi-page content
    let yPosition = margin + 20;
    const imgData = canvas.toDataURL("image/png", 0.95);
    
    if (pdfContentHeight <= contentHeight) {
      // Content fits on one page
      pdf.addImage(imgData, "PNG", margin, yPosition, pdfContentWidth, pdfContentHeight, undefined, "FAST");
    } else {
      // Content spans multiple pages
      let sourceY = 0;
      let remainingHeight = imgHeight;
      const sourceHeightPerPage = (imgHeight * contentHeight) / pdfContentHeight;

      while (remainingHeight > 0) {
        const currentSourceHeight = Math.min(sourceHeightPerPage, remainingHeight);
        const currentPdfHeight = (currentSourceHeight * pdfContentWidth) / imgWidth;

        // Create a temporary canvas for this page
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgWidth;
        pageCanvas.height = currentSourceHeight;
        const ctx = pageCanvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(canvas, 0, sourceY, imgWidth, currentSourceHeight, 0, 0, imgWidth, currentSourceHeight);
          const pageImgData = pageCanvas.toDataURL("image/png", 0.95);
          pdf.addImage(pageImgData, "PNG", margin, margin, pdfContentWidth, currentPdfHeight, undefined, "FAST");
        }

        sourceY += currentSourceHeight;
        remainingHeight -= currentSourceHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
        }
      }
    }

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error("Error exporting document to PDF:", error);
    throw new Error(`Failed to export document: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Parse inline formatting for Word export
 */
function parseInlineFormattingForWord(text: string): TextRun[] {
  const runs: TextRun[] = [];
  
  if (!text.includes("**") && !text.includes("*") && !text.includes("__")) {
    return [new TextRun(text)];
  }

  // Split by formatting markers, preserving them
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|__.*?__)/g);
  
  for (const part of parts) {
    if (!part) continue;
    
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      runs.push(new TextRun({ text: part.slice(2, -2), bold: true }));
    } else if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**") && part.length > 2) {
      runs.push(new TextRun({ text: part.slice(1, -1), italics: true }));
    } else if (part.startsWith("__") && part.endsWith("__") && part.length > 4) {
      runs.push(new TextRun({ text: part.slice(2, -2), underline: {} }));
    } else if (part) {
      runs.push(new TextRun(part));
    }
  }

  return runs.length > 0 ? runs : [new TextRun(text)];
}

/**
 * Convert EditorJS blocks to docx Paragraph elements
 */
function editorJSToDocx(blocks: OutputData["blocks"]): Paragraph[] {
  const paragraphs: Paragraph[] = [];

  if (!blocks || blocks.length === 0) {
    return paragraphs;
  }

  blocks.forEach((block) => {
    if (!block || !block.type) return;

    switch (block.type) {
      case "header": {
        const level = Math.min(Math.max(block.data?.level || 1, 1), 6);
        const text = block.data?.text || "";
        if (text) {
          const headingLevels = [
            HeadingLevel.HEADING_1,
            HeadingLevel.HEADING_2,
            HeadingLevel.HEADING_3,
            HeadingLevel.HEADING_4,
            HeadingLevel.HEADING_5,
            HeadingLevel.HEADING_6,
          ];
          paragraphs.push(
            new Paragraph({
              text: String(text),
              heading: headingLevels[level - 1],
              spacing: { after: 200 },
            })
          );
        }
        break;
      }
      case "paragraph": {
        const text = block.data?.text || "";
        if (text) {
          const runs = parseInlineFormattingForWord(String(text));
          paragraphs.push(
            new Paragraph({
              children: runs,
              spacing: { after: 200 },
            })
          );
        }
        break;
      }
      case "list": {
        const items = Array.isArray(block.data?.items) ? block.data.items : [];
        const style = block.data?.style || "unordered";
        
        items.forEach((item: string) => {
          if (item) {
            if (style === "ordered") {
              paragraphs.push(
                new Paragraph({
                  text: String(item),
                  spacing: { after: 100 },
                  indent: { left: 720 },
                })
              );
            } else {
              paragraphs.push(
                new Paragraph({
                  text: String(item),
                  bullet: { level: 0 },
                  spacing: { after: 100 },
                })
              );
            }
          }
        });
        break;
      }
      case "quote": {
        const text = block.data?.text || "";
        const caption = block.data?.caption || "";
        if (text) {
          paragraphs.push(
            new Paragraph({
              text: String(text),
              spacing: { before: 200, after: 200 },
              indent: { left: 720 },
              border: {
                left: {
                  color: "3B82F6",
                  size: 4,
                  style: BorderStyle.SINGLE,
                },
              },
            })
          );
          if (caption) {
            paragraphs.push(
              new Paragraph({
                text: `— ${String(caption)}`,
                spacing: { after: 200 },
                alignment: AlignmentType.RIGHT,
              })
            );
          }
        }
        break;
      }
      case "code": {
        const code = block.data?.code || "";
        if (code) {
          paragraphs.push(
            new Paragraph({
              text: String(code),
              spacing: { before: 200, after: 200 },
              shading: { fill: "F3F4F6" },
              border: {
                top: { color: "E5E7EB", size: 1, style: BorderStyle.SINGLE },
                bottom: { color: "E5E7EB", size: 1, style: BorderStyle.SINGLE },
                left: { color: "E5E7EB", size: 1, style: BorderStyle.SINGLE },
                right: { color: "E5E7EB", size: 1, style: BorderStyle.SINGLE },
              },
            })
          );
        }
        break;
      }
      case "linkTool": {
        const link = block.data?.link || "";
        const meta = block.data?.meta || {};
        if (link) {
          if (meta.title) {
            paragraphs.push(
              new Paragraph({
                text: String(meta.title),
                heading: HeadingLevel.HEADING_4,
                spacing: { after: 100 },
              })
            );
          }
          if (meta.description) {
            paragraphs.push(
              new Paragraph({
                text: String(meta.description),
                spacing: { after: 100 },
              })
            );
          }
          paragraphs.push(
            new Paragraph({
              children: [new TextRun({ text: String(link), style: "Hyperlink" })],
              spacing: { after: 200 },
            })
          );
        }
        break;
      }
      default:
        if (block.data?.text) {
          paragraphs.push(
            new Paragraph({
              text: String(block.data.text),
              spacing: { after: 200 },
            })
          );
        }
    }
  });

  return paragraphs;
}

/**
 * Export document (EditorJS content) to Word (DOCX)
 */
export async function exportDocumentToWord(
  content: OutputData | string,
  title: string = "Document",
  filename: string = "document.docx"
): Promise<void> {
  try {
    const blocks = parseContent(content);
    
    if (blocks.length === 0) {
      throw new Error("Document has no content to export");
    }

    // Convert to docx paragraphs
    const paragraphs = editorJSToDocx(blocks);

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 400 },
            }),
            ...paragraphs,
          ],
        },
      ],
    });

    // Generate and download
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting document to Word:", error);
    throw new Error(`Failed to export document: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
