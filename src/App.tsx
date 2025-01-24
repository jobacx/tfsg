import { Toaster } from "@/components/ui/toaster"
import { FileStructureGenerator } from "./components/file-structure-generator"

function App() {
  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Text File Structure Generator</h1>
        <FileStructureGenerator />
      </div>
      <Toaster />
    </>
  )
}

export default App
