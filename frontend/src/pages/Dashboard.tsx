import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"upload" | "paste">("upload");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 🔹 Read file content
  const readFile = (file: File) => {
    if (!file.name.endsWith(".py")) {
      alert("Only .py files allowed");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      setCode(e.target.result || "");
    };
    reader.readAsText(file);
  };

  // 🔹 File input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  };

  // 🔹 Drag & drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // 🔹 Analyze → go to Workspace
  const handleAnalyze = () => {
    if (!code.trim()) {
      alert("Upload or paste code first");
      return;
    }

    navigate("/workspace", {
      state: { code },
    });
  };

  return (
    <div className="p-6 text-white">
      {/* HEADER */}
      <h2 className="text-xl mb-4">Smart Python Refactorer</h2>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab("upload")}
          className={`pb-2 ${
            activeTab === "upload"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          ⬆ Upload File
        </button>

        <button
          onClick={() => setActiveTab("paste")}
          className={`pb-2 ${
            activeTab === "paste"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400"
          }`}
        >
          {"</>"} Paste Code
        </button>

        <button className="pb-2 text-gray-500 cursor-not-allowed">
          GitHub Repo
        </button>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div>
          {activeTab === "upload" && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-600 p-10 text-center rounded-lg cursor-pointer hover:border-blue-500 transition"
            >
              <p className="text-gray-400">
                Drop a Python file here <br /> or click to browse (.py only)
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".py"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}

          {activeTab === "paste" && (
            <textarea
              className="w-full h-64 p-3 bg-black border border-gray-700 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your Python code here..."
            />
          )}

          {/* ANALYZE BUTTON */}
          <Button className="mt-4 w-full" onClick={handleAnalyze}>
            🔍 Analyze Code
          </Button>
        </div>

        {/* RIGHT PANEL (PREVIEW) */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-3 py-2 text-sm">
            source.py - Preview
          </div>

          <Editor
            height="320px"
            language="python"
            theme="vs-dark"
            value={code || "# Upload or paste Python code to preview"}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
            }}
          />
        </div>
      </div>
    </div>
  );
}