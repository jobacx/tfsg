import { FolderIcon, FileIcon } from "lucide-react"

interface FileStructureDisplayProps {
  structure: string[]
}

export function FileStructureDisplay({ structure }: FileStructureDisplayProps) {
  const renderItem = (item: string, index: number) => {
    const indent = item.search(/\S/)
    const isFile = !item.trim().endsWith("/")
    const Icon = isFile ? FileIcon : FolderIcon
    const itemName = item.trim().replace("/", "")

    return (
      <div key={index} className="flex items-center space-x-2" style={{ paddingLeft: `${indent * 0.5}rem` }}>
        <Icon className={`w-4 h-4 ${isFile ? "text-blue-500" : "text-yellow-500"}`} />
        <span>{itemName}</span>
      </div>
    )
  }

  return (
    <div className="bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Generated File Structure</h2>
      <div className="font-mono">{structure.map((item, index) => renderItem(item, index))}</div>
    </div>
  )
}

