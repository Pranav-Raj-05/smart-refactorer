import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { FileCode, Clock, Eye } from "lucide-react";
import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export interface RefactorJob {
  id: string;
  fileName: string;
  status: "success" | "processing" | "error";
  functions: number;
  docstringsAdded: number;
  timestamp: string;
  codePreview: string;
}

const statusVariant: Record<string, "success" | "processing" | "destructive"> = {
  success: "success",
  processing: "processing",
  error: "destructive",
};

interface RecentJobsTableProps {
  jobs: RefactorJob[];
}

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">Recent Refactor Jobs</h3>
      </div>
      {/* Table header */}
      <div className="grid grid-cols-[1fr_80px_100px_90px_60px] gap-2 px-4 py-2 border-b bg-secondary/30 text-xs font-medium text-muted-foreground uppercase tracking-wider">
        <span>File Name</span>
        <span>Functions</span>
        <span>Docstrings</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <div className="divide-y divide-border">
        {jobs.map((job, i) => (
          <HoverCard key={job.id} openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div
                className="grid grid-cols-[1fr_80px_100px_90px_60px] gap-2 items-center px-4 py-3 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileCode className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-mono font-medium text-foreground truncate">{job.fileName}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <Clock className="h-3 w-3" /> {job.timestamp}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{job.functions} fn</span>
                <span className="text-sm font-mono text-muted-foreground">{job.docstringsAdded} docs</span>
                <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                <button className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
                  <Eye className="h-3.5 w-3.5" />
                </button>
              </div>
            </HoverCardTrigger>
            <HoverCardContent side="top" className="w-96 p-0 bg-card border shadow-xl">
              <div className="px-3 py-2 border-b bg-secondary/30">
                <span className="text-xs font-mono text-muted-foreground">{job.fileName} — preview</span>
              </div>
              <pre className="p-3 text-xs font-mono text-foreground/80 overflow-hidden max-h-[200px]">
                {job.codePreview}
              </pre>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}
