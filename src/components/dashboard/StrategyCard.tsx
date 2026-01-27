import { Copy, BarChart3, TrendingUp, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiskGauge } from "./RiskGauge";
import { Button } from "@/components/ui/button";
import type { Strategy } from "@/data/mockData";

interface StrategyCardProps {
  strategy: Strategy;
}

export function StrategyCard({ strategy }: StrategyCardProps) {
  return (
    <article className="glass-card p-4 hover:border-border transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={strategy.author.avatar}
            alt={strategy.author.name}
            className="h-9 w-9 rounded-full bg-muted"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">{strategy.author.name}</span>
              {strategy.author.badge && (
                <span className="text-[10px] font-medium text-secondary bg-secondary/10 px-1.5 py-0.5 rounded">
                  {strategy.author.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{strategy.createdAt}</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Risk
          </span>
          <RiskGauge score={strategy.riskScore} size="sm" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-foreground">
          {strategy.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {strategy.description}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {strategy.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 flex items-center gap-4 border-t border-border/40 pt-3">
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className={cn(
            "h-3.5 w-3.5",
            strategy.roi >= 0 ? "text-primary" : "text-destructive"
          )} />
          <span className={cn(
            "font-medium font-mono",
            strategy.roi >= 0 ? "text-primary" : "text-destructive"
          )}>
            {strategy.roi >= 0 ? "+" : ""}{strategy.roi}%
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {strategy.timeframe}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {strategy.copiedCount.toLocaleString()}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex gap-2">
        <Button variant="default" size="sm" className="flex-1 gap-1.5 h-8 text-xs">
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5 h-8 text-xs border-border">
          <BarChart3 className="h-3.5 w-3.5" />
          Chart
        </Button>
      </div>
    </article>
  );
}