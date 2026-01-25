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
      <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
        <h3 className="font-semibold text-foreground text-sm">Markets</h3>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-muted/40 border border-border/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Asset List */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
        {filteredAssets.map((asset, index) => {
          const isSelected = selectedAsset === asset.symbol;
          const isPositive = asset.change24h >= 0;

          return (
            <button
              key={asset.symbol}
              onClick={() => onSelectAsset(asset.symbol)}
              className={`w-full flex items-center justify-between p-3 transition-all border-b border-border/20 last:border-b-0 ${
                isSelected
                  ? 'bg-primary/10 border-l-2 border-l-primary'
                  : 'hover:bg-muted/30 border-l-2 border-l-transparent'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg' 
                    : 'bg-muted/60 text-foreground'
                }`}
                style={isSelected ? { boxShadow: '0 4px 12px hsl(172 85% 50% / 0.3)' } : {}}
                >
                  {asset.icon}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {asset.symbol}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      /USDT
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    Vol ${(asset.volume24h / 1e9).toFixed(1)}B
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold text-sm text-foreground">
                  ${asset.price.toLocaleString()}
                </div>
                <div className={`flex items-center justify-end gap-1 text-[11px] font-semibold ${
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