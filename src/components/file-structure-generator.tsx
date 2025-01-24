import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardIcon, CheckIcon, RefreshCcwIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StructureItem {
  indent: number
  name: string
  comment?: string
}

export function FileStructureGenerator() {
  const [input, setInput] = useState("")
  const [generatedStructure, setGeneratedStructure] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(false)
  const { toast } = useToast()

  const generateStructure = useCallback(() => {
    const lines = input.split("\n").filter((line) => line.trim() !== "")
    const structure: StructureItem[] = lines.map((line) => {
      const indent = line.search(/\S/)
      const [name, comment] = line
        .trim()
        .split("#")
        .map((s) => s.trim())
      return { indent, name, comment }
    })

    const maxNameLength = Math.max(...structure.map((item) => item.name.length + item.indent * 4))

    let result = "project-root/\n"
    structure.forEach((item, index) => {
      const isLast = index === structure.length - 1 || structure[index + 1].indent <= item.indent
      const prefix = "│   ".repeat(item.indent) + (isLast ? "└── " : "├── ")
      const paddedName = (prefix + item.name).padEnd(maxNameLength + 8)
      const commentPart = item.comment ? `# ${item.comment}` : ""
      result += `${paddedName}${commentPart}\n`

      if (isLast && index < structure.length - 1) {
        const nextIndent = structure[index + 1].indent
        for (let i = item.indent + 1; i < nextIndent; i++) {
          result += "│   ".repeat(i) + "│\n"
        }
      }
    })

    setGeneratedStructure(result)
  }, [input])

  useEffect(() => {
    if (autoGenerate) {
      generateStructure()
    }
  }, [input, autoGenerate, generateStructure])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedStructure)
      setIsCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The generated structure has been copied to your clipboard.",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      toast({
        title: "Failed to copy",
        description: "There was an error copying to the clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setInput("")
    setGeneratedStructure("")
    setAutoGenerate(false)
    toast({
      title: "Form reset",
      description: "The input and generated structure have been cleared.",
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input">Enter your file structure (use spaces for indentation and # for comments):</Label>
        <Textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your file structure here. Use spaces for indentation and # for comments."
          className="font-mono h-64"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="auto-generate"
          checked={autoGenerate}
          onCheckedChange={(checked) => setAutoGenerate(checked as boolean)}
        />
        <Label htmlFor="auto-generate">Auto-generate structure</Label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={generateStructure} disabled={autoGenerate}>
          Generate Structure
        </Button>
        <Button onClick={resetForm} variant="outline" className="flex items-center gap-2">
          <RefreshCcwIcon className="w-4 h-4" />
          Reset
        </Button>
      </div>
      {generatedStructure && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="generated-structure">Generated Structure:</Label>
            <Button onClick={copyToClipboard} variant="outline" size="sm" className="flex items-center gap-2">
              {isCopied ? (
                <>
                  <CheckIcon className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <ClipboardIcon className="w-4 h-4" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
          <Textarea id="generated-structure" value={generatedStructure} readOnly className="font-mono h-64" />
        </div>
      )}
    </div>
  )
}