import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, DollarSign, Zap } from "lucide-react";
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
      title: `${type === 'buy' ? '🟢 Buy' : '🔴 Sell'} Order Executed`,
      description: `${numAmount.toFixed(4)} ${symbol} at $${currentPrice.toLocaleString()}`,
    });

    setAmount('');
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground">Trade {symbol}</h3>
          </div>
          <span className="text-xl font-bold font-mono text-foreground">
            ${currentPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Order Type Tabs */}
        <Tabs value={orderType} onValueChange={(v) => setOrderType(v as 'market' | 'limit')}>
          <TabsList className="w-full bg-muted/40 p-1">
            <TabsTrigger 
              value="market" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Market
            </TabsTrigger>
            <TabsTrigger 
              value="limit" 
              className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Limit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="limit" className="mt-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-sm">Limit Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder={currentPrice.toString()}
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="pl-9 bg-muted/40 border-border/50 focus:border-primary"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Amount Input */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-sm">Amount ({symbol})</Label>
            <span className="text-xs text-muted-foreground">
              Max: <span className="text-foreground font-mono">{maxBuyAmount.toFixed(4)}</span>
            </span>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-muted/40 border-border/50 font-mono text-lg h-12 focus:border-primary"
          />
          
          {/* Quick Amount Buttons */}
          <div className="flex gap-2">
            {[0.25, 0.5, 0.75, 1].map((percent) => (
              <button
                key={percent}
                onClick={() => handleQuickAmount(percent)}
                className="flex-1 py-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                {percent * 100}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage Selector */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-muted-foreground text-sm">Leverage</Label>
            <span className="text-sm font-bold text-primary font-mono">{leverage}x</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 5, 10, 20].map((lev) => (
              <button
                key={lev}
                onClick={() => setLeverage(lev)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                  leverage === lev
                    ? 'bg-primary text-primary-foreground border-primary shadow-lg'
                    : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground border-border/50 hover:border-primary/30'
                }`}
                style={leverage === lev ? { boxShadow: '0 4px 12px hsl(172 85% 50% / 0.25)' } : {}}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Trade Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Value</span>
            <span className="font-mono font-bold text-foreground text-base">
              ${(totalValue * leverage).toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-px bg-border/50" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Available Balance</span>
            <span className="font-mono text-foreground">
              ${balance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleTrade('buy')}
            className="trading-btn-buy h-12 text-base"
            disabled={numAmount <= 0 || totalValue > balance}
          >
            <ArrowUpRight className="w-5 h-5 mr-1.5" />
            Long
          </Button>
          <Button
            onClick={() => handleTrade('sell')}
            className="trading-btn-sell h-12 text-base"
            disabled={numAmount <= 0}
          >
            <ArrowDownRight className="w-5 h-5 mr-1.5" />
            Short
          </Button>
        </div>
      </div>
    </div>
  );
}