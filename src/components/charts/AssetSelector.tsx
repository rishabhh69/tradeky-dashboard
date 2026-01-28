import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { RealtimeAsset } from "@/hooks/useRealtimePrices";

interface AssetSelectorProps {
  selectedAsset: string;
  onSelectAsset: (symbol: string) => void;
  assets: RealtimeAsset[];
}

export function AssetSelector({ selectedAsset, onSelectAsset, assets }: AssetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [flashingAssets, setFlashingAssets] = useState<Record<string, 'up' | 'down' | null>>({});

  const filteredAssets = assets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track price changes for flash effect
  useEffect(() => {
    const newFlashing: Record<string, 'up' | 'down' | null> = {};
    assets.forEach(asset => {
      if (asset.priceDirection !== 'neutral') {
        newFlashing[asset.symbol] = asset.priceDirection;
      }
    });
    setFlashingAssets(newFlashing);
    
    const timer = setTimeout(() => setFlashingAssets({}), 500);
    return () => clearTimeout(timer);
  }, [assets.map(a => a.lastUpdate).join(',')]);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border">
        <h3 className="font-medium text-foreground text-sm">Markets</h3>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2 py-1.5 bg-muted/50 border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="max-h-[380px] overflow-y-auto scrollbar-thin">
        {filteredAssets.map((asset) => {
          const isSelected = selectedAsset === asset.symbol;
          const isPositive = asset.change24h >= 0;
          const flash = flashingAssets[asset.symbol];

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 transition-colors border-b border-border/30 last:border-b-0",
                isSelected
                  ? 'bg-primary/10 border-l-2 border-l-primary'
                  : 'hover:bg-muted/50 border-l-2 border-l-transparent'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-7 h-7 rounded flex items-center justify-center text-xs font-semibold transition-colors",
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                )}>
                  {asset.icon}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "font-medium text-xs",
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}>
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-muted-foreground">/USDT</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "font-mono text-xs transition-colors duration-300",
                  flash === 'up' && 'text-primary',
                  flash === 'down' && 'text-destructive',
                  !flash && 'text-foreground'
                )}>
                  <span className={cn(
                    "inline-block transition-transform duration-300",
                    flash === 'up' && 'animate-tick-up',
                    flash === 'down' && 'animate-tick-down'
                  )}>
                    ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={cn(
                  "flex items-center justify-end gap-0.5 text-[10px] font-medium",
                  isPositive ? 'text-primary' : 'text-destructive'
                )}>
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}