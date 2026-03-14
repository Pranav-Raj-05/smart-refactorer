import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Editor from "@monaco-editor/react";
import DiffViewer from "@/components/DiffViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Download,
  FunctionSquare,
  BookOpen,
  Zap,
  Upload
} from "lucide-react";

interface DetectedFunction {
  name: string;
  line: number;
  has_docstring: boolean;
}

export default function Workspace() {

  const location = useLocation();
  const editorRef = useRef<any>(null);

  const initialCode =
    (location.state as { code?: string })?.code || "";

  const [sourceCode, setSourceCode] = useState(initialCode);
  const [refactoredCode, setRefactoredCode] = useState("");
  const [functions, setFunctions] = useState<DetectedFunction[]>([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    functions: 0,
    docstrings: 0,
    coverage: 0,
    validation: "Pending"
  });

  /*
  LOAD SAVED STATE
  */

  useEffect(() => {

    const savedCode = localStorage.getItem("sourceCode");
    const savedRefactored = localStorage.getItem("refactoredCode");
    const savedFunctions = localStorage.getItem("functions");
    const savedSummary = localStorage.getItem("summary");

    if (savedCode) setSourceCode(savedCode);
    if (savedRefactored) setRefactoredCode(savedRefactored);
    if (savedFunctions) setFunctions(JSON.parse(savedFunctions));
    if (savedSummary) setSummary(JSON.parse(savedSummary));

  }, []);

  /*
  SAVE STATE
  */

  useEffect(() => {
    localStorage.setItem("sourceCode", sourceCode);
  }, [sourceCode]);

  useEffect(() => {
    localStorage.setItem("refactoredCode", refactoredCode);
  }, [refactoredCode]);

  useEffect(() => {
    localStorage.setItem("functions", JSON.stringify(functions));
  }, [functions]);

  useEffect(() => {
    localStorage.setItem("summary", JSON.stringify(summary));
  }, [summary]);

  /*
  EDITOR CONTROL
  */

  const handleEditorMount = (editor:any) => {
    editorRef.current = editor;
  };

  const jumpToLine = (line:number) => {

    if (!editorRef.current) return;

    editorRef.current.revealLineInCenter(line);
    editorRef.current.setPosition({ lineNumber: line, column: 1 });
    editorRef.current.focus();
  };

  /*
  MULTIPLE FILE UPLOAD
  */

  const handleMultipleUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const files = event.target.files;

    if (!files) return;

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    console.log(data);

    const firstFile = data.files[0].result;

    setSourceCode(await files[0].text());
    setRefactoredCode(firstFile.refactored_code);
    setFunctions(firstFile.functions);

    localStorage.setItem(
      "refactorLogs",
      JSON.stringify(firstFile.logs)
    );

    const coverage =
      firstFile.functions_detected === 0
        ? 0
        : Math.round(
            (firstFile.docstrings_added /
              firstFile.functions_detected) * 100
          );

    setSummary({
      functions: firstFile.functions_detected,
      docstrings: firstFile.docstrings_added,
      coverage: coverage,
      validation: firstFile.execution_result?.success
        ? "Passed"
        : "Failed"
    });
  };

  /*
  RUN REFACTOR
  */

  const handleRefactor = async () => {

    if (!sourceCode.trim()) return;

    setLoading(true);

    try {

      const blob = new Blob([sourceCode], { type: "text/x-python" });
      const file = new File([blob], "source.py");

      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      const result = data.files[0].result;

      setRefactoredCode(result.refactored_code);
      setFunctions(result.functions);

      localStorage.setItem(
        "refactorLogs",
        JSON.stringify(result.logs)
      );

      const coverage =
        result.functions_detected === 0
          ? 0
          : Math.round(
              (result.docstrings_added /
                result.functions_detected) * 100
            );

      setSummary({
        functions: result.functions_detected,
        docstrings: result.docstrings_added,
        coverage: coverage,
        validation: result.execution_result?.success
          ? "Passed"
          : "Failed"
      });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /*
  DOWNLOAD
  */

  const handleDownload = () => {

    const blob = new Blob([refactoredCode], { type: "text/x-python" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "refactored.py";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">

      {/* Toolbar */}

      <div className="flex items-center gap-3 border-b px-4 py-3 bg-card">

        <Button size="sm" onClick={handleRefactor} disabled={loading}>
          <Play className="h-4 w-4 mr-1" />
          {loading ? "Analyzing..." : "Run Refactor"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          disabled={!refactoredCode}
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>

        <label className="cursor-pointer flex items-center gap-2 border px-3 py-1 rounded-md">
          <Upload className="h-4 w-4" />
          Upload Python Files
          <input
            type="file"
            multiple
            accept=".py"
            hidden
            onChange={handleMultipleUpload}
          />
        </label>

      </div>

      {/* Main layout */}

      <div className="flex flex-1">

        {/* Function sidebar */}

        <div className="w-56 border-r bg-card">

          <div className="border-b px-3 py-2 text-xs font-mono flex items-center gap-2">
            <FunctionSquare className="h-3.5 w-3.5" />
            Functions ({functions.length})
          </div>

          <div className="overflow-y-auto">

            {functions.map((fn) => (

              <div
                key={fn.name + fn.line}
                onClick={() => jumpToLine(fn.line)}
                className="px-3 py-2 text-xs border-b font-mono cursor-pointer hover:bg-muted"
              >
                {fn.name} (L{fn.line})
              </div>

            ))}

          </div>

        </div>

        {/* Source editor */}

        <div className="flex-1 border-r flex flex-col">

          <div className="border-b px-3 py-2 text-xs font-mono">
            source.py
          </div>

          <Editor
            height="100%"
            language="python"
            theme="vs-dark"
            value={sourceCode}
            onMount={handleEditorMount}
            onChange={(v) => setSourceCode(v || "")}
            options={{
              fontSize: 13,
              minimap: { enabled: false }
            }}
          />

        </div>

        {/* Diff viewer */}

        <div className="flex-1 flex flex-col">

          <div className="border-b px-3 py-2 text-xs font-mono">
            Code Diff
          </div>

          <DiffViewer
            oldCode={sourceCode}
            newCode={refactoredCode}
          />

        </div>

      </div>

      {/* Summary */}

      <div className="border-t bg-card px-4 py-3 flex gap-6 text-sm">

        <div className="flex items-center gap-2">
          <FunctionSquare className="h-4 w-4 text-primary" />
          Functions: {summary.functions}
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-green-500" />
          Docstrings Added: {summary.docstrings}
        </div>

        <div className="flex items-center gap-2">
          Coverage: {summary.coverage}%
        </div>

        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          <Badge>
            {summary.validation}
          </Badge>
        </div>

      </div>

    </div>
  );
}