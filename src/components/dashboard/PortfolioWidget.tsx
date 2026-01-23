import { TrendingUp, ArrowUpRight } from "lucide-react";
import { mockPortfolio } from "@/data/mockData";

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg className="h-16 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <polygon
        fill="url(#sparklineGradient)"
        points={`0,100 ${points} 100,100`}
      />
      {/* Line */}
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function PortfolioWidget() {
  const { balance, change, changePercent, sparklineData } = mockPortfolio;

  return (
    <div className="glass-card overflow-hidden">
      <div className="neon-border-primary rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Demo Portfolio</span>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            Paper Trading
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">
              ${balance.toLocaleString()}
            </span>
            <span className="text-lg font-medium text-muted-foreground">.00</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm font-medium text-primary">
              <ArrowUpRight className="h-4 w-4" />
              +${change.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground">
              ({changePercent}% today)
            </span>
          </div>
        </div>

        <div className="mt-4">
          <Sparkline data={sparklineData} />
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Add Funds
          </button>
          <button className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/5">
            Trade Now
          </button>
        </div>
      </div>
    </div>
  );
}
