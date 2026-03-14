import { useState } from "react";
import { FileUploadZone } from "@/components/FileUploadZone";
import { CodePreviewPanel } from "@/components/CodePreviewPanel";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCode(text);
    };

    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    navigate("/workspace", {
      state: { code }
    });
  };

  return (
    <div className="container py-8 space-y-8 max-w-7xl">

      {/* Title */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold font-mono text-foreground">
          Smart Python Refactorer
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Upload Python code to detect missing docstrings and automatically refactor it.
        </p>
      </motion.div>

      {/* Upload + Preview */}
      <div className="grid lg:grid-cols-2 gap-6">

        <div className="space-y-4">

          <FileUploadZone
            onFileSelect={handleFile}
            onCodePaste={setCode}
            pastedCode={code}
          />

          <Button
            onClick={handleAnalyze}
            disabled={!code.trim()}
            className="w-full"
            size="lg"
          >
            <Search className="h-4 w-4 mr-2" />
            Analyze Code
          </Button>

        </div>

        <CodePreviewPanel
          code={code}
          title="source.py — Preview"
        />

      </div>

    </div>
  );
}