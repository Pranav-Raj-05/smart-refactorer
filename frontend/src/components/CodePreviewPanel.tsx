import Editor from "@monaco-editor/react";
import { motion } from "framer-motion";

interface CodePreviewPanelProps {
  code: string;
  title?: string;
}

export function CodePreviewPanel({ code, title = "Code Preview" }: CodePreviewPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg border bg-card overflow-hidden h-full flex flex-col"
    >
      <div className="border-b px-3 py-2 bg-secondary/30">
        <span className="text-xs font-mono text-muted-foreground">{title}</span>
      </div>
      <div className="flex-1 min-h-[300px]">
        <Editor
          height="100%"
          language="python"
          theme="vs-dark"
          value={code || "# Upload or paste Python code to preview"}
          options={{
            readOnly: true,
            fontSize: 12,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            padding: { top: 12 },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "none",
          }}
        />
      </div>
    </motion.div>
  );
}
