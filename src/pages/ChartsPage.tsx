import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { CandlestickChart } from "@/components/charts/CandlestickChart";
import { TradingPanel } from "@/components/charts/TradingPanel";
import { IndicatorsPanel } from "@/components/charts/IndicatorsPanel";
import { AssetSelector } from "@/components/charts/AssetSelector";
import { PositionsPanel } from "@/components/charts/PositionsPanel";
import { mockMarketAssets, mockPortfolio } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Maximize2, 
  Camera, 
  Settings,
  TrendingUp,
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
      
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold bg-primary text-primary-foreground`}>
                  {currentAsset.icon}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    {currentAsset.symbol}/USDT
                  </h1>
                  <p className="text-sm text-muted-foreground">{currentAsset.name}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                currentAsset.change24h >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold font-mono">
                  {currentAsset.change24h >= 0 ? '+' : ''}{currentAsset.change24h.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Balance Display */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg glass-card">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">Demo Balance:</span>
                <span className="font-bold font-mono text-foreground">
                  ${balance.toLocaleString()}
                </span>
              </div>

              <Button variant="ghost" size="icon">
                <Camera className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="px-6 pb-3 flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground mr-2">Timeframe:</span>
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Panel - Asset Selector */}
            <div className="col-span-2 space-y-6">
              <AssetSelector 
                selectedAsset={selectedAsset} 
                onSelectAsset={setSelectedAsset} 
              />
            </div>

            {/* Center - Chart */}
            <div className="col-span-7 space-y-6">
              <div className="chart-container">
                <CandlestickChart 
                  showVolume={true}
                  indicators={activeIndicators}
                />
              </div>
              
              <PositionsPanel />
            </div>

            {/* Right Panel - Trading */}
            <div className="col-span-3 space-y-6">
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
