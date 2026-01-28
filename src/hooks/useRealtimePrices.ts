import { useState, useEffect, useCallback } from 'react';
import { mockMarketAssets, MarketAsset } from '@/data/mockData';

export interface RealtimeAsset extends MarketAsset {
  previousPrice: number;
  priceDirection: 'up' | 'down' | 'neutral';
  lastUpdate: number;
}

export function useRealtimePrices(intervalMs: number = 2000) {
  const [assets, setAssets] = useState<RealtimeAsset[]>(() => 
    mockMarketAssets.map(asset => ({
      ...asset,
      previousPrice: asset.price,
      priceDirection: 'neutral' as const,
      lastUpdate: Date.now(),
    }))
  );

  const simulatePriceChange = useCallback(() => {
    setAssets(prev => prev.map(asset => {
      // Random price movement: -0.5% to +0.5%
      const volatility = 0.005;
      const change = (Math.random() - 0.5) * 2 * volatility * asset.price;
      const newPrice = Math.max(0.01, asset.price + change);
      
      // Calculate new 24h change
      const basePrice = asset.price / (1 + asset.change24h / 100);
      const newChange24h = ((newPrice - basePrice) / basePrice) * 100;
      
      return {
        ...asset,
        previousPrice: asset.price,
        price: Math.round(newPrice * 100) / 100,
        change24h: Math.round(newChange24h * 100) / 100,
        priceDirection: newPrice > asset.price ? 'up' : newPrice < asset.price ? 'down' : 'neutral',
        lastUpdate: Date.now(),
      };
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(simulatePriceChange, intervalMs);
    return () => clearInterval(interval);
  }, [simulatePriceChange, intervalMs]);

  const getAsset = useCallback((symbol: string) => {
    return assets.find(a => a.symbol === symbol);
  }, [assets]);

  return { assets, getAsset };
}
