import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
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
    <svg className="h-12 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#sparklineGradient)"
        points={`0,100 ${points} 100,100`}
      />
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
  const isPositive = change >= 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Portfolio</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
          Demo
        </span>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-semibold text-foreground font-mono">
          ${balance.toLocaleString()}<span className="text-muted-foreground text-lg">.00</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`flex items-center gap-0.5 text-sm font-medium ${isPositive ? 'text-primary' : 'text-destructive'}`}>
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {isPositive ? '+' : ''}${Math.abs(change).toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground">
            ({isPositive ? '+' : ''}{changePercent}%)
          </span>
        </div>
      </div>

      <Sparkline data={sparklineData} />

      <div className="flex gap-2 mt-4">
        <button className="flex-1 py-2 text-sm font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
          Add Funds
        </button>
        <button className="flex-1 py-2 text-sm font-medium border border-border text-foreground rounded hover:bg-muted transition-colors">
          Trade
        </button>
      </div>
    </div>
  );
}