import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Percent, DollarSign } from "lucide-react";
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
        description: "You don't have enough coins for this trade",
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
      title: `${type === 'buy' ? 'Buy' : 'Sell'} Order Placed`,
      description: `${numAmount} ${symbol} at $${currentPrice.toLocaleString()}`,
    });

    setAmount('');
  };

  return (
    <div className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Trade {symbol}</h3>
        <span className="text-xl font-bold font-mono text-foreground">
          ${currentPrice.toLocaleString()}
        </span>
      </div>

      {/* Order Type Tabs */}
      <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
        <TabsList className="w-full bg-muted/50">
          <TabsTrigger value="market" className="flex-1">Market</TabsTrigger>
          <TabsTrigger value="limit" className="flex-1">Limit</TabsTrigger>
        </TabsList>

        <TabsContent value="limit" className="mt-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Limit Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder={currentPrice.toString()}
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                className="pl-9 bg-muted/30 border-border/50"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Amount Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground">Amount ({symbol})</Label>
          <span className="text-xs text-muted-foreground">
            Max: {maxBuyAmount.toFixed(6)}
          </span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-muted/30 border-border/50 font-mono"
        />
        
        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {[0.25, 0.5, 0.75, 1].map((percent) => (
            <button
              key={percent}
              onClick={() => handleQuickAmount(percent)}
              className="flex-1 py-1.5 rounded-md bg-muted/50 hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {percent * 100}%
            </button>
          ))}
        </div>
      </div>

      {/* Leverage Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground">Leverage</Label>
          <span className="text-sm font-medium text-foreground">{leverage}x</span>
        </div>
        <div className="flex gap-2">
          {[1, 2, 5, 10, 20].map((lev) => (
            <button
              key={lev}
              onClick={() => setLeverage(lev)}
              className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${
                leverage === lev
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {lev}x
            </button>
          ))}
        </div>
      </div>

      {/* Trade Summary */}
      <div className="p-3 rounded-lg bg-muted/30 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Value</span>
          <span className="font-mono font-medium text-foreground">
            ${(totalValue * leverage).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Available</span>
          <span className="font-mono text-foreground">
            ${balance.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Buy/Sell Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleTrade('buy')}
          className="bg-success hover:bg-success/90 text-success-foreground font-semibold"
          disabled={numAmount <= 0 || totalValue > balance}
        >
          <ArrowUpRight className="w-4 h-4 mr-1" />
          Buy Long
        </Button>
        <Button
          onClick={() => handleTrade('sell')}
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold"
          disabled={numAmount <= 0}
        >
          <ArrowDownRight className="w-4 h-4 mr-1" />
          Sell Short
        </Button>
      </div>
    </div>
  );
}
