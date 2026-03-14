import { useCallback, useState } from "react";
import { Upload, FileCode, Github, Code2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type TabKey = "upload" | "paste" | "github";

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onCodePaste: (code: string) => void;
  pastedCode: string;
}

export function FileUploadZone({ onFileSelect, onCodePaste, pastedCode }: FileUploadZoneProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "upload", label: "Upload File", icon: <Upload className="h-3.5 w-3.5" /> },
    { key: "paste", label: "Paste Code", icon: <Code2 className="h-3.5 w-3.5" /> },
    { key: "github", label: "GitHub Repo", icon: <Github className="h-3.5 w-3.5" /> },
  ];

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file?.name.endsWith(".py")) {
        setFileName(file.name);
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activeTab === "upload" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input id="file-input" type="file" accept=".py" className="hidden" onChange={handleChange} />
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary mb-3">
              {fileName ? (
                <FileCode className="h-5 w-5 text-primary" />
              ) : (
                <Upload className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            {fileName ? (
              <>
                <p className="text-sm font-mono font-medium text-primary">{fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">File loaded — click to replace</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">Drop a Python file here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse • .py files only</p>
              </>
            )}
          </motion.div>
        )}

        {activeTab === "paste" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Textarea
              placeholder={"# Paste your Python code here\ndef hello():\n    print('Hello, World!')"}
              className="h-[180px] resize-none font-mono text-sm bg-background border-border"
              value={pastedCode}
              onChange={(e) => onCodePaste(e.target.value)}
            />
          </motion.div>
        )}

        {activeTab === "github" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <Input
              placeholder="https://github.com/user/repo"
              className="font-mono text-sm bg-background"
            />
            <p className="text-xs text-muted-foreground">
              Enter a GitHub repository URL to fetch Python files for analysis.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
