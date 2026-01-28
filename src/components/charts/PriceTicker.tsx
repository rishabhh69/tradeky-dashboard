import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RealtimeAsset } from '@/hooks/useRealtimePrices';

interface PriceTickerProps {
  asset: RealtimeAsset;
  showChange?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTicker({ asset, showChange = true, size = 'md' }: PriceTickerProps) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (asset.priceDirection !== 'neutral') {
      setFlash(asset.priceDirection);
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [asset.lastUpdate, asset.priceDirection]);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const changeSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className="flex items-center gap-2.5">
      <span 
        className={cn(
          "font-semibold font-mono text-foreground transition-colors duration-300",
          sizeClasses[size],
          flash === 'up' && 'text-primary',
          flash === 'down' && 'text-destructive'
        )}
      >
        <span 
          className={cn(
            "inline-block transition-all duration-300",
            flash === 'up' && 'animate-tick-up',
            flash === 'down' && 'animate-tick-down'
          )}
        >
          ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </span>
      
      {showChange && (
        <span className={cn(
          "flex items-center gap-1 font-medium transition-colors duration-300",
          changeSizeClasses[size],
          asset.change24h >= 0 ? 'text-primary' : 'text-destructive'
        )}>
          {asset.change24h >= 0 
            ? <TrendingUp className={cn(
                "transition-transform duration-300",
                size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4',
                flash === 'up' && 'scale-110'
              )} /> 
            : <TrendingDown className={cn(
                "transition-transform duration-300",
                size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-3.5 h-3.5' : 'w-4 h-4',
                flash === 'down' && 'scale-110'
              )} />
          }
          {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
        </span>
      )}
    </div>
  );
}
