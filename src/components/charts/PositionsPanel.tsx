import { mockPositions, type Position } from "@/data/mockData";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionsPanelProps {
  positions?: Position[];
  onClosePosition?: (id: string) => void;
}

export function PositionsPanel({ positions = mockPositions, onClosePosition }: PositionsPanelProps) {
  if (positions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-muted-foreground">No open positions</p>
        <p className="text-sm text-muted-foreground mt-1">Your trades will appear here</p>
      </div>
    );
  }

  const totalPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const isPositive = totalPnl >= 0;

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Open Positions</h3>
          <div className={`flex items-center gap-1 font-mono font-semibold ${
            isPositive ? 'text-success' : 'text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{totalPnl.toFixed(2)} USD
          </div>
        </div>
      </div>

      <div className="divide-y divide-border/30">
        {positions.map((position) => {
          const isProfit = position.pnl >= 0;
          const isLong = position.type === 'long';

          return (
            <div key={position.id} className="p-4 hover:bg-muted/10 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    isLong ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                  }`}>
                    {isLong ? 'LONG' : 'SHORT'}
                  </span>
                  <span className="font-semibold text-foreground">{position.asset}/USDT</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClosePosition?.(position.id)}
                  className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Size</p>
                  <p className="font-mono font-medium text-foreground">{position.size}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Entry</p>
                  <p className="font-mono font-medium text-foreground">${position.entryPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">PnL</p>
                  <p className={`font-mono font-semibold ${isProfit ? 'text-success' : 'text-destructive'}`}>
                    {isProfit ? '+' : ''}{position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
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
