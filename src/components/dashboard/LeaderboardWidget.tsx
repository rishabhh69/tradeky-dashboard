import { Trophy, Award, Medal, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockLeaderboard } from "@/data/mockData";

const rankIcons = {
  1: Trophy,
  2: Award,
  3: Medal,
};

const rankColors = {
  1: "text-yellow-400",
  2: "text-slate-300",
  3: "text-amber-600",
};

export function LeaderboardWidget() {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
            <Trophy className="h-4 w-4 text-secondary" />
          </div>
          <span className="text-sm font-medium text-foreground">Top Traders This Week</span>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {mockLeaderboard.map((entry) => {
          const RankIcon = rankIcons[entry.rank as keyof typeof rankIcons] || Medal;
          const rankColor = rankColors[entry.rank as keyof typeof rankColors] || "text-muted-foreground";

          return (
            <div
              key={entry.rank}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors",
                entry.rank === 1 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : "hover:bg-white/5"
              )}
            >
              <div className={cn("flex h-8 w-8 items-center justify-center", rankColor)}>
                <RankIcon className="h-5 w-5" />
              </div>
              <img
                src={entry.avatar}
                alt={entry.name}
                className="h-9 w-9 rounded-full ring-2 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium text-foreground">{entry.name}</span>
                  {entry.isPropCertified && (
                    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-1.5 py-0.5">
                      <Shield className="h-3 w-3 text-primary" />
                      <span className="text-[10px] font-medium text-primary">Prop Certified</span>
                    </div>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">Rank #{entry.rank}</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-primary">+{entry.roi}%</span>
                <p className="text-xs text-muted-foreground">ROI</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
