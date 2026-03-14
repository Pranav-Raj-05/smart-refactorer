import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "info" | "success" | "error" | "warning";
  message: string;
}

const typeColors: Record<string, string> = {
  info: "text-primary",
  success: "text-success",
  error: "text-destructive",
  warning: "text-warning",
};

const typeLabels: Record<string, string> = {
  info: "INFO",
  success: " OK ",
  error: " ERR",
  warning: "WARN",
};

interface TerminalOutputProps {
  logs: LogEntry[];
}

export function TerminalOutput({ logs }: TerminalOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [logs]);

  return (
    <div className="rounded-lg border bg-terminal-bg overflow-hidden">
      <div className="flex items-center gap-2 border-b px-4 py-2.5 bg-card">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-destructive/60" />
          <div className="h-3 w-3 rounded-full bg-warning/60" />
          <div className="h-3 w-3 rounded-full bg-success/60" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">terminal — execution logs</span>
        <span className="ml-auto text-[10px] font-mono text-muted-foreground">{logs.length} entries</span>
      </div>
      <div ref={scrollRef} className="p-4 max-h-[600px] overflow-y-auto">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.015 }}
            className={`flex gap-2 font-mono text-xs leading-6 ${log.type === "error" ? "bg-destructive/5 -mx-2 px-2 rounded" : ""}`}
          >
            <span className="text-muted-foreground/60 shrink-0 select-none">{log.timestamp}</span>
            <span className={`shrink-0 font-bold ${typeColors[log.type]}`}>
              [{typeLabels[log.type]}]
            </span>
            <span className={`${log.type === "error" ? "text-destructive/90" : "text-foreground/80"}`}>
              {log.message}
            </span>
          </motion.div>
        ))}
        <div className="flex items-center gap-1 mt-2">
          <span className="text-success font-mono text-xs">$</span>
          <span className="terminal-cursor text-success font-mono text-xs">▋</span>
        </div>
      </div>
    </div>
  );
}
