import { PortfolioWidget } from "./PortfolioWidget";
import { LeaderboardWidget } from "./LeaderboardWidget";
import { Users, TrendingUp } from "lucide-react";

export function WidgetsPanel() {
  return (
    <div className="flex flex-col gap-4">
      <PortfolioWidget />
      <LeaderboardWidget />
      
      {/* Platform Stats */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Platform Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Traders</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">12,847</p>
          </div>
          <div className="p-3 rounded bg-muted/50">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Strategies</span>
            </div>
            <p className="text-lg font-semibold text-foreground font-mono">3,291</p>
          </div>
        </div>
      </div>
    </div>
  );
}