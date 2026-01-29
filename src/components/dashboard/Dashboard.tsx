import { Sidebar } from "./Sidebar";
import { StrategyFeed } from "./StrategyFeed";
import { WidgetsPanel } from "./WidgetsPanel";
import { AIHelperButton } from "./AIHelperButton";
import { Bell, Search, Settings } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-60">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <div className="hidden md:flex items-center gap-2 rounded-lg glass-card px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground border border-white/10">
                ⌘K
              </kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-secondary" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Feed */}
              <div className="lg:col-span-2">
                <StrategyFeed />
              </div>
              
              {/* Widgets Panel */}
              <div className="hidden lg:block">
                <WidgetsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>

      <AIHelperButton />
    </div>
  );
}