"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ClipboardIcon, CheckIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function FileStructureGenerator() {
  const [input, setInput] = useState("")
  const [generatedStructure, setGeneratedStructure] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const generateStructure = () => {
    const lines = input.split("\n").filter((line) => line.trim() !== "")
    const structure = lines.map((line) => {
      const indent = line.search(/\S/)
      const name = line.trim()
      return { indent, name }
    })

    let result = ".\n"
    structure.forEach((item, index) => {
      const isLast = index === structure.length - 1 || structure[index + 1].indent <= item.indent
      const prefix = "│   ".repeat(item.indent) + (isLast ? "└── " : "├── ")
      result += `${prefix}${item.name}\n`

      if (item.name === "docs") {
        result += `${prefix.replace("└──", "   ").replace("├──", "│  ")}    # Documentation files (alternatively \`doc\`)\n`
      }

      if (isLast && index < structure.length - 1) {
        const nextIndent = structure[index + 1].indent
        for (let i = item.indent + 1; i < nextIndent; i++) {
          result += "│   ".repeat(i) + "│\n"
        }
      }
    })

    setGeneratedStructure(result)
  }

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="input">Enter your file structure (use spaces for indentation):</Label>
        <Textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your file structure here. Use spaces for indentation to represent nesting."
          className="font-mono h-64"
        />
      </div>
      <Button onClick={generateStructure}>Generate Structure</Button>
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

