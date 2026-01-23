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
    <article className="glass-card-hover group p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={strategy.author.avatar}
            alt={strategy.author.name}
            className="h-10 w-10 rounded-full ring-2 ring-white/10 transition-all group-hover:ring-primary/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">{strategy.author.name}</span>
              {strategy.author.badge && (
                <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-[10px] font-medium text-secondary">
                  {strategy.author.badge}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{strategy.createdAt}</span>
          </div>
        </div>

        {/* Risk Score */}
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            AI Risk Score
          </span>
          <RiskGauge score={strategy.riskScore} size="md" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
          {strategy.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {strategy.description}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {strategy.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-4 border-t border-white/5 pt-4">
        <div className="flex items-center gap-1.5 text-sm">
          <TrendingUp className={cn(
            "h-4 w-4",
            strategy.roi >= 0 ? "text-primary" : "text-destructive"
          )} />
          <span className={cn(
            "font-semibold",
            strategy.roi >= 0 ? "text-primary" : "text-destructive"
          )}>
            {strategy.roi >= 0 ? "+" : ""}{strategy.roi}%
          </span>
          <span className="text-muted-foreground">ROI</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{strategy.timeframe}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{strategy.copiedCount.toLocaleString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <Button variant="default" size="sm" className="flex-1 gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
          <Copy className="h-4 w-4" />
          Copy Strategy
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-2 border-white/10 hover:bg-white/5">
          <BarChart3 className="h-4 w-4" />
          View Chart
        </Button>
      </div>
    </article>
  );
}
