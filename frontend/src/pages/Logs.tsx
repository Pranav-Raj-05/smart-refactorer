import { TerminalOutput } from "@/components/TerminalOutput";
import { motion } from "framer-motion";

export default function Logs() {

  const storedLogs = localStorage.getItem("refactorLogs");

  const logs = storedLogs ? JSON.parse(storedLogs) : [];

  return (
    <div className="container py-8 space-y-6 max-w-5xl">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        <h1 className="text-2xl font-bold font-mono text-foreground">
          Execution Logs
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Refactor pipeline output and validation results.
        </p>

      </motion.div>

      {logs.length === 0 ? (
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          No logs yet. Run a refactor to see execution logs.
        </div>
      ) : (
        <TerminalOutput logs={logs} />
      )}

    </div>
  );
}