import { PortfolioWidget } from "./PortfolioWidget";
import { LeaderboardWidget } from "./LeaderboardWidget";
import { Flame, Zap } from "lucide-react";

export function WidgetsPanel() {
  return (
    <div className="flex flex-col gap-6">
      <PortfolioWidget />
      <LeaderboardWidget />
      
      {/* Quick Stats Card */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-medium text-foreground">Platform Stats</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">Active Traders</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">12,847</p>
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Strategies</span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">3,291</p>
          </div>
        </div>
      </div>
    </div>
  );
}
