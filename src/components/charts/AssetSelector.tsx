import { mockMarketAssets, type MarketAsset } from "@/data/mockData";
import { TrendingUp, TrendingDown } from "lucide-react";

interface AssetSelectorProps {
  selectedAsset: string;
  onSelectAsset: (symbol: string) => void;
}

export function AssetSelector({ selectedAsset, onSelectAsset }: AssetSelectorProps) {
  return (
    <div className="glass-card p-4">
      <h3 className="font-semibold text-foreground mb-3">Markets</h3>
      <div className="space-y-1">
        {mockMarketAssets.map((asset) => {
          const isSelected = selectedAsset === asset.symbol;
          const isPositive = asset.change24h >= 0;

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-primary/10 border border-primary/30'
                  : 'hover:bg-muted/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-foreground'
                }`}>
                  {asset.icon}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{asset.symbol}</span>
                    <span className="text-xs text-muted-foreground">{asset.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Vol: ${(asset.volume24h / 1e9).toFixed(2)}B
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-medium text-foreground">
                  ${asset.price.toLocaleString()}
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  isPositive ? 'text-success' : 'text-destructive'
                }`}>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
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
