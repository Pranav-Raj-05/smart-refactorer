import { Code2, LayoutDashboard, Terminal, FolderGit2 } from "lucide-react";
import { NavItem } from "./NavItem";

export function AppNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between max-w-7xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <span className="font-mono text-sm font-bold tracking-tight text-foreground">
              SmartRefactorer
            </span>
          </div>
          <nav className="flex items-center gap-1">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/workspace" icon={FolderGit2} label="Workspace" />
            <NavItem to="/logs" icon={Terminal} label="Logs" />
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-muted-foreground">v1.0.0</span>
          <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
        </div>
      </div>
    </header>
  );
}
