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
      <div className="glass-card p-6 text-center">
        <Layers className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No open positions</p>
      </div>
    );
  }

  const totalPnl = positions.reduce((acc, pos) => acc + pos.pnl, 0);
  const isPositive = totalPnl >= 0;

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Open Positions</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {positions.length}
            </span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded font-mono text-xs font-medium ${
            isPositive ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}${totalPnl.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="divide-y divide-border/40">
        {positions.map((position) => {
          const isProfit = position.pnl >= 0;
          const isLong = position.type === 'long';

          return (
            <div key={position.id} className="p-3 hover:bg-muted/20 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded uppercase ${
                    isLong ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {isLong ? 'Long' : 'Short'}
                  </span>
                  <span className="text-sm font-medium text-foreground">{position.asset}</span>
                  <span className="text-xs text-muted-foreground">/USDT</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClosePosition?.(position.id)}
                  className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-3 h-3 mr-1" />
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-muted/30 rounded p-2">
                  <p className="text-muted-foreground text-[10px] mb-0.5">Size</p>
                  <p className="font-mono font-medium text-foreground">{position.size}</p>
                </div>
                <div className="bg-muted/30 rounded p-2">
                  <p className="text-muted-foreground text-[10px] mb-0.5">Entry</p>
                  <p className="font-mono font-medium text-foreground">${position.entryPrice.toLocaleString()}</p>
                </div>
                <div className="bg-muted/30 rounded p-2">
                  <p className="text-muted-foreground text-[10px] mb-0.5">Liq.</p>
                  <p className="font-mono text-muted-foreground">---</p>
                </div>
                <div className={`rounded p-2 ${isProfit ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  <p className="text-muted-foreground text-[10px] mb-0.5">PnL</p>
                  <p className={`font-mono font-medium ${isProfit ? 'text-primary' : 'text-destructive'}`}>
                    {isProfit ? '+' : ''}{position.pnl.toFixed(2)}
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