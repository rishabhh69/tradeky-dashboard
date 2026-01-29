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
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        fill="url(#sparklineGradient)"
        points={`0,100 ${points} 100,100`}
      />
      <polyline
        fill="none"
        stroke="#22d3ee"
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
        <span className="badge-fuchsia">
          Demo
        </span>
      </div>

      <div className="mb-4">
        <div className="text-2xl font-semibold text-foreground font-mono text-glow-sm">
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
        <button className="flex-1 py-2 text-sm font-medium btn-primary-premium rounded-lg transition-all">
          Add Funds
        </button>
        <button className="flex-1 py-2 text-sm font-medium border border-white/10 text-foreground rounded-lg hover:bg-white/5 transition-colors">
          Trade
        </button>
      </div>
    </div>
  );
}