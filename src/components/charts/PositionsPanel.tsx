import { mockPositions, type Position } from "@/data/mockData";
import { TrendingUp, TrendingDown, X, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsPanelProps {
  positions?: Position[];
  onClosePosition?: (id: string) => void;
}

export function PositionsPanel({ positions = mockPositions, onClosePosition }: PositionsPanelProps) {
  if (positions.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
          <Layers className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground font-medium">No open positions</p>
        <p className="text-sm text-muted-foreground mt-1">Your trades will appear here</p>
      </div>
    );
  }

  const totalPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const isPositive = totalPnl >= 0;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Open Positions</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
              {positions.length}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm ${
            isPositive 
              ? 'bg-success/15 text-success' 
              : 'bg-destructive/15 text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="divide-y divide-border/30">
        {positions.map((position, index) => {
          const isProfit = position.pnl >= 0;
          const isLong = position.type === 'long';

          return (
            <div 
              key={position.id} 
              className="p-4 hover:bg-muted/20 transition-all animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                    isLong 
                      ? 'bg-success/20 text-success border border-success/30' 
                      : 'bg-destructive/20 text-destructive border border-destructive/30'
                  }`}>
                    {isLong ? 'Long' : 'Short'}
                  </span>
                  <span className="font-semibold text-foreground">{position.asset}</span>
                  <span className="text-xs text-muted-foreground">/USDT</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClosePosition?.(position.id)}
                  className="h-7 px-2.5 hover:bg-destructive/15 hover:text-destructive text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">Size</p>
                  <p className="font-mono font-semibold text-foreground">{position.size}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">Entry</p>
                  <p className="font-mono font-semibold text-foreground">${position.entryPrice.toLocaleString()}</p>
                </div>
                <div className="bg-muted/30 rounded-lg p-2.5">
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">Liq. Price</p>
                  <p className="font-mono font-semibold text-warning">$---</p>
                </div>
                <div className={`rounded-lg p-2.5 ${isProfit ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <p className="text-muted-foreground text-[10px] uppercase tracking-wide mb-0.5">PnL</p>
                  <p className={`font-mono font-bold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                    {isProfit ? '+' : ''}{position.pnl.toFixed(2)}
                    <span className="text-[10px] ml-1">({position.pnlPercent.toFixed(1)}%)</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}