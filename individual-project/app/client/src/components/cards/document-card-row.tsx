import type { Document } from "@/types/workspace"

const DocumentCardRow = ({document}: {document: Document}) => {
  return (
    <div className="flex items-center gap-3 justify-between">
        <h1>{document.title}</h1>

        <div>
            <span>{document.createdAt}</span>
        </div>
    </div>
  )
}

export default DocumentCardRow