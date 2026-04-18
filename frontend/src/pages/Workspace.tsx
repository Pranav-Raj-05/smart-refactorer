import { useState } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import DiffViewer from "@/components/DiffViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Download } from "lucide-react";

export default function Workspace() {

  const location = useLocation();
  const initialCode = (location.state as any)?.code || "";

  const [sourceCode, setSourceCode] = useState(initialCode);
  const [refactoredCode, setRefactoredCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    functions: 0,
    docstrings: 0,
    coverage: 0,
    validation: "Pending"
  });

  const handleRefactor = async () => {

    if (!sourceCode.trim()) return;

    setLoading(true);
    setRefactoredCode("");

    try {
      const formData = new FormData();
      const file = new File([sourceCode], "code.py");

      formData.append("files", file);

      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      const result = data.files[0].result;

      setRefactoredCode(result.refactored_code);

      setSummary({
        functions: result.functions_detected,
        docstrings: result.docstrings_added,
        coverage:
          result.functions_detected === 0
            ? 0
            : Math.round(
                (result.docstrings_added /
                  result.functions_detected) * 100
              ),
        validation: result.execution_result?.success
          ? "Passed"
          : "Failed"
      });

    } catch (err) {
      alert("Backend error");
    }

    setLoading(false);
  };

  const handleDownload = () => {
    const blob = new Blob([refactoredCode], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "refactored.py";
    a.click();
  };

  return (
    <div className="flex flex-col h-screen">

      <div className="flex gap-3 p-3 border-b bg-gray-900">

        <Button onClick={handleRefactor}>
          <Play className="mr-1 h-4 w-4" />
          {loading ? "Analyzing..." : "Run Refactor"}
        </Button>

        <Button onClick={handleDownload}>
          <Download className="mr-1 h-4 w-4" />
          Download
        </Button>

      </div>

      <div className="flex flex-1">

        <div className="w-1/2">
          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={sourceCode}
            onChange={(v) => setSourceCode(v || "")}
          />
        </div>

        <div className="w-1/2">
          <DiffViewer oldCode={sourceCode} newCode={refactoredCode} />
        </div>

      </div>

      <div className="flex gap-6 p-3 border-t text-sm bg-gray-900">
        <div>Functions: {summary.functions}</div>
        <div>Docstrings: {summary.docstrings}</div>
        <div>Coverage: {summary.coverage}%</div>
        <Badge>{summary.validation}</Badge>
      </div>

    </div>
  );
}