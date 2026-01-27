import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { TradingPanel } from "@/components/charts/TradingPanel";
import { IndicatorsPanel } from "@/components/charts/IndicatorsPanel";
import { AssetSelector } from "@/components/charts/AssetSelector";
import { PositionsPanel } from "@/components/charts/PositionsPanel";
import { mockMarketAssets, mockPortfolio } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Maximize2, 
  Camera, 
  Settings,
  TrendingUp,
  TrendingDown,
  Wallet
} from "lucide-react";

const timeframes = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

export default function ChartsPage() {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1H');
  const [activeIndicators, setActiveIndicators] = useState<string[]>(['SMA']);
  const [balance, setBalance] = useState(mockPortfolio.balance);

  const currentAsset = mockMarketAssets.find(a => a.symbol === selectedAsset) || mockMarketAssets[0];

  const handleToggleIndicator = (indicator: string) => {
    setActiveIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  const handleTrade = (trade: { type: 'buy' | 'sell'; amount: number; price: number }) => {
    if (trade.type === 'buy') {
      setBalance(prev => prev - trade.amount * trade.price);
    } else {
      setBalance(prev => prev + trade.amount * trade.price);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-60">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-5 h-14">
            <div className="flex items-center gap-4">
              {/* Asset Info */}
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {currentAsset.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-base font-semibold text-foreground">
                      {currentAsset.symbol}
                    </h1>
                    <span className="text-xs text-muted-foreground">/USDT</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentAsset.name}</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2.5 pl-4 border-l border-border">
                <span className="text-xl font-semibold font-mono text-foreground">
                  ${currentAsset.price.toLocaleString()}
                </span>
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  currentAsset.change24h >= 0 ? 'text-primary' : 'text-destructive'
                }`}>
                  {currentAsset.change24h >= 0 
                    ? <TrendingUp className="w-3.5 h-3.5" /> 
                    : <TrendingDown className="w-3.5 h-3.5" />
                  }
                  {currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Balance */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-border bg-muted/30">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground">Balance</span>
                  <span className="text-sm font-semibold font-mono text-foreground">
                    ${balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                  <Maximize2 className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeframe */}
          <div className="px-5 pb-3 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">Timeframe</span>
            </div>
            <div className="flex items-center gap-0.5 p-0.5 rounded bg-muted/50">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    selectedTimeframe === tf
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>

            {activeIndicators.length > 0 && (
              <div className="flex items-center gap-1.5 ml-2 pl-3 border-l border-border">
                <span className="text-xs text-muted-foreground">Indicators:</span>
                <div className="flex gap-1">
                  {activeIndicators.map((ind) => (
                    <span 
                      key={ind} 
                      className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <div className="p-5">
          <div className="grid grid-cols-12 gap-4">
            {/* Asset Selector */}
            <div className="col-span-2">
              <AssetSelector 
                selectedAsset={selectedAsset} 
                onSelectAsset={setSelectedAsset} 
              />
            </div>

            {/* Chart */}
            <div className="col-span-7 space-y-4">
              <div className="glass-card overflow-hidden">
                <CandlestickChart 
                  showVolume={true}
                  indicators={activeIndicators}
                />
              </div>
              <PositionsPanel />
            </div>

            {/* Trading Panel */}
            <div className="col-span-3 space-y-4">
              <TradingPanel
                currentPrice={currentAsset.price}
                symbol={currentAsset.symbol}
                balance={balance}
                onTrade={handleTrade}
              />
              <IndicatorsPanel
                activeIndicators={activeIndicators}
                onToggleIndicator={handleToggleIndicator}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}