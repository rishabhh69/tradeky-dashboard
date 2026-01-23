import { Sidebar } from "./Sidebar";
import { StrategyFeed } from "./StrategyFeed";
import { WidgetsPanel } from "./WidgetsPanel";
import { AIHelperButton } from "./AIHelperButton";
import { Bell, Search, Settings } from "lucide-react";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <div className="pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <div className="hidden md:flex items-center gap-2 rounded-lg border border-white/10 bg-muted/30 px-3 py-1.5">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search strategies, traders..."
                className="w-64 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Main Feed - Takes 2 columns */}
              <div className="lg:col-span-2">
                <StrategyFeed />
              </div>
              
              {/* Widgets Panel - Takes 1 column */}
              <div className="hidden lg:block">
                <WidgetsPanel />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Helper */}
      <AIHelperButton />
    </div>
  );
}
