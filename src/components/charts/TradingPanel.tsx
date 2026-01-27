import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TradingPanelProps {
  currentPrice: number;
  symbol: string;
  balance: number;
  onTrade: (trade: { type: 'buy' | 'sell'; amount: number; price: number }) => void;
}

export function TradingPanel({ currentPrice, symbol, balance, onTrade }: TradingPanelProps) {
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const { toast } = useToast();

  const numAmount = parseFloat(amount) || 0;
  const totalValue = numAmount * currentPrice;
  const maxBuyAmount = balance / currentPrice;

  const handleQuickAmount = (percent: number) => {
    const newAmount = (maxBuyAmount * percent).toFixed(6);
    setAmount(newAmount);
  };

  const handleTrade = (type: 'buy' | 'sell') => {
    if (numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (type === 'buy' && totalValue > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds for this trade",
        variant: "destructive",
      });
      return;
    }

    onTrade({
      type,
      amount: numAmount,
      price: orderType === 'limit' ? parseFloat(limitPrice) : currentPrice,
    });

    toast({
      title: `${type === 'buy' ? 'Buy' : 'Sell'} Order Executed`,
      description: `${numAmount.toFixed(4)} ${symbol} at $${currentPrice.toLocaleString()}`,
    });

    setAmount('');
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Trade {symbol}</h3>
          <span className="text-lg font-semibold font-mono text-foreground">
            ${currentPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order Type */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
          <TabsList className="w-full bg-muted p-0.5 h-8">
            <TabsTrigger value="market" className="flex-1 text-xs h-7 data-[state=active]:bg-background">
              Market
            </TabsTrigger>
            <TabsTrigger value="limit" className="flex-1 text-xs h-7 data-[state=active]:bg-background">
              Limit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="limit" className="mt-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Limit Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={currentPrice.toString()}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="pl-8 h-9 bg-muted/50 border-border text-sm"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Amount */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-xs">Amount ({symbol})</Label>
            <span className="text-[10px] text-muted-foreground">
              Max: <span className="font-mono">{maxBuyAmount.toFixed(4)}</span>
            </span>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-muted/50 border-border font-mono h-10"
          />
          
          <div className="flex gap-1.5">
            {[0.25, 0.5, 0.75, 1].map((percent) => (
              <button
                key={percent}
                onClick={() => handleQuickAmount(percent)}
                className="flex-1 py-1.5 rounded bg-muted hover:bg-muted/80 border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {percent * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-xs">Leverage</Label>
            <span className="text-xs font-semibold text-primary font-mono">{leverage}x</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 5, 10, 20].map((lev) => (
              <button
                key={lev}
                onClick={() => setLeverage(lev)}
                className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors border ${
                  leverage === lev
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground hover:text-foreground border-border'
                }`}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="p-3 rounded bg-muted/50 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Total Value</span>
            <span className="font-mono font-medium text-foreground">
              ${(totalValue * leverage).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Available</span>
            <span className="font-mono text-foreground">${balance.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={() => handleTrade('buy')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10"
            disabled={numAmount <= 0 || totalValue > balance}
          >
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Long
          </Button>
          <Button
            onClick={() => handleTrade('sell')}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-10"
            disabled={numAmount <= 0}
          >
            <ArrowDownRight className="w-4 h-4 mr-1" />
            Short
          </Button>
        </div>
      </div>
    </div>
  );
}