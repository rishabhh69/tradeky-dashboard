import { Trophy, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockLeaderboard } from "@/data/mockData";

export function LeaderboardWidget() {
  return (
    <div className="glass-card">
      <div className="flex items-center justify-between p-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Top Traders</span>
        </div>
        <button className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-0.5">
          View All
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="divide-y divide-border/40">
        {mockLeaderboard.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors"
          >
            <span className={cn(
              "w-6 h-6 rounded flex items-center justify-center text-xs font-semibold",
              entry.rank === 1 ? "bg-amber-500/10 text-amber-500" :
              entry.rank === 2 ? "bg-slate-400/10 text-slate-400" :
              entry.rank === 3 ? "bg-orange-500/10 text-orange-500" :
              "bg-muted text-muted-foreground"
            )}>
              {entry.rank}
            </span>
            <img
              src={entry.avatar}
              alt={entry.name}
              className="h-8 w-8 rounded-full bg-muted"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-foreground truncate block">{entry.name}</span>
              {entry.isPropCertified && (
                <span className="text-[10px] text-primary">Verified</span>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-primary font-mono">+{entry.roi}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}