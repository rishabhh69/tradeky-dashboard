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
  Wallet,
  Activity
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
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-2xl border-b border-border/40">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-5">
              {/* Asset Info */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg"
                  style={{ boxShadow: '0 4px 14px hsl(172 85% 50% / 0.3)' }}
                >
                  {currentAsset.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground font-display">
                      {currentAsset.symbol}
                    </h1>
                    <span className="text-sm text-muted-foreground">/USDT</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{currentAsset.name}</p>
                </div>
              </div>

              {/* Price Badge */}
              <div className="flex items-center gap-3 pl-5 border-l border-border/50">
                <span className="text-2xl font-bold font-mono text-foreground">
                  ${currentAsset.price.toLocaleString()}
                </span>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-semibold ${
                  currentAsset.change24h >= 0 
                    ? 'bg-success/15 text-success border border-success/20' 
                    : 'bg-destructive/15 text-destructive border border-destructive/20'
                }`}>
                  {currentAsset.change24h >= 0 
                    ? <TrendingUp className="w-4 h-4" /> 
                    : <TrendingDown className="w-4 h-4" />
                  }
                  {currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Balance Display */}
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-card">
                <div className="p-1.5 rounded-lg bg-primary/15">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Demo Balance</span>
                  <span className="font-bold font-mono text-foreground">
                    ${balance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-muted/50">
                  <Maximize2 className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="px-6 pb-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Timeframe</span>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/30">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  style={selectedTimeframe === tf ? { boxShadow: '0 2px 8px hsl(172 85% 50% / 0.3)' } : {}}
                >
                  {tf}
                </button>
              ))}
            </div>

            {/* Active indicators mini display */}
            {activeIndicators.length > 0 && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border/50">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-1.5">
                  {activeIndicators.map((ind) => (
                    <span 
                      key={ind} 
                      className="text-xs px-2 py-0.5 rounded bg-muted/50 text-muted-foreground font-medium"
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
        <div className="p-6">
          <div className="grid grid-cols-12 gap-5">
            {/* Left Panel - Asset Selector */}
            <div className="col-span-2 space-y-5">
              <AssetSelector 
                selectedAsset={selectedAsset} 
                onSelectAsset={setSelectedAsset} 
              />
            </div>

            {/* Center - Chart */}
            <div className="col-span-7 space-y-5">
              <div className="chart-container-premium">
                <CandlestickChart 
                  showVolume={true}
                  indicators={activeIndicators}
                />
              </div>
              
              <PositionsPanel />
            </div>

            {/* Right Panel - Trading */}
            <div className="col-span-3 space-y-5">
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