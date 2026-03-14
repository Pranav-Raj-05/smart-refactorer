import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: boolean;
  subtitle?: string;
}

export function StatCard({ label, value, icon: Icon, accent, subtitle }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border bg-card p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${accent ? "bg-primary/15" : "bg-secondary"}`}>
          <Icon className={`h-4 w-4 ${accent ? "text-primary" : "text-muted-foreground"}`} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold font-mono text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </motion.div>
  );
}

interface CoverageCardProps {
  before: number;
  after: number;
}

export function CoverageCard({ before, after }: CoverageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border bg-card p-4"
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documentation Coverage</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-lg font-mono text-muted-foreground">{before}%</span>
        <span className="text-muted-foreground">→</span>
        <span className="text-2xl font-bold font-mono text-success">{after}%</span>
      </div>
      <div className="mt-3 flex gap-1 h-2 rounded-full overflow-hidden bg-secondary">
        <div className="h-full rounded-full bg-muted-foreground/30 animate-fill" style={{ width: `${before}%` }} />
        <div className="h-full rounded-full bg-success animate-fill" style={{ width: `${after - before}%`, animationDelay: '0.3s' }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground">Before</span>
        <span className="text-[10px] text-success">After</span>
      </div>
    </motion.div>
  );
}
