import { mockMarketAssets, type MarketAsset } from "@/data/mockData";
import { TrendingUp, TrendingDown, Search } from "lucide-react";
import { useState } from "react";

interface AssetSelectorProps {
  selectedAsset: string;
  onSelectAsset: (symbol: string) => void;
}

export function AssetSelector({ selectedAsset, onSelectAsset }: AssetSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = mockMarketAssets.filter(
    (asset) =>
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={`w-full flex items-center justify-between p-2.5 transition-colors border-b border-border/30 last:border-b-0 ${
                isSelected
                  ? 'bg-primary/10 border-l-2 border-l-primary'
                  : 'hover:bg-muted/50 border-l-2 border-l-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded flex items-center justify-center text-xs font-semibold ${
                  isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
                }`}>
                  {asset.icon}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className={`font-medium text-xs ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-muted-foreground">/USDT</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-foreground">
                  ${asset.price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end gap-0.5 text-[10px] font-medium ${
                  isPositive ? 'text-primary' : 'text-destructive'
                }`}>
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