import { useState, useMemo } from "react";
import { generateCandleData, type CandleData } from "@/data/mockData";

interface CandlestickChartProps {
  data?: CandleData[];
  showVolume?: boolean;
  indicators?: string[];
}

export function CandlestickChart({ 
  data: externalData, 
  showVolume = true,
  indicators = []
}: CandlestickChartProps) {
  const data = useMemo(() => externalData || generateCandleData(60), [externalData]);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);

  const chartWidth = 800;
  const chartHeight = 400;
  const volumeHeight = 80;
  const padding = { top: 20, right: 60, bottom: 30, left: 10 };
  
  const candleWidth = (chartWidth - padding.left - padding.right) / data.length;
  const candleGap = candleWidth * 0.2;
  const actualCandleWidth = candleWidth - candleGap;

  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.1;

  const maxVolume = Math.max(...data.map(d => d.volume));

  const priceToY = (price: number) => {
    return padding.top + (1 - (price - (minPrice - pricePadding)) / (priceRange + 2 * pricePadding)) * (chartHeight - padding.top - padding.bottom);
  };

  const volumeToHeight = (volume: number) => {
    return (volume / maxVolume) * volumeHeight * 0.8;
  };

  // Calculate SMA
  const calculateSMA = (period: number): number[] => {
    return data.map((_, i) => {
      if (i < period - 1) return NaN;
      const sum = data.slice(i - period + 1, i + 1).reduce((acc, d) => acc + d.close, 0);
      return sum / period;
    });
  };

  // Calculate EMA
  const calculateEMA = (period: number): number[] => {
    const multiplier = 2 / (period + 1);
    const ema: number[] = [];
    
    data.forEach((candle, i) => {
      if (i === 0) {
        ema.push(candle.close);
      } else {
        ema.push((candle.close - ema[i - 1]) * multiplier + ema[i - 1]);
      }
    });
    
    return ema;
  };

  // Calculate Bollinger Bands
  const calculateBollingerBands = (): { upper: number[]; middle: number[]; lower: number[] } => {
    const period = 20;
    const stdDev = 2;
    const sma = calculateSMA(period);
    
    const bands = { upper: [] as number[], middle: sma, lower: [] as number[] };
    
    data.forEach((_, i) => {
      if (i < period - 1) {
        bands.upper.push(NaN);
        bands.lower.push(NaN);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = sma[i];
        const variance = slice.reduce((acc, d) => acc + Math.pow(d.close - mean, 2), 0) / period;
        const std = Math.sqrt(variance);
        bands.upper.push(mean + stdDev * std);
        bands.lower.push(mean - stdDev * std);
      }
    });
    
    return bands;
  };

  const sma20 = indicators.includes('SMA') ? calculateSMA(20) : [];
  const ema12 = indicators.includes('EMA') ? calculateEMA(12) : [];
  const bollinger = indicators.includes('BB') ? calculateBollingerBands() : null;

  const createLinePath = (values: number[]): string => {
    return values
      .map((value, i) => {
        if (isNaN(value)) return '';
        const x = padding.left + i * candleWidth + candleWidth / 2;
        const y = priceToY(value);
        return `${i === 0 || isNaN(values[i - 1]) ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  const latestCandle = data[data.length - 1];
  const priceChange = latestCandle.close - latestCandle.open;
  const priceChangePercent = (priceChange / latestCandle.open) * 100;

  return (
    <div className="w-full">
      {/* Price Info Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-2xl font-bold font-mono text-foreground">
              ${(hoveredCandle || latestCandle).close.toLocaleString()}
            </span>
            <span className={`ml-2 text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </span>
          </div>
        </div>
        {hoveredCandle && (
          <div className="flex gap-4 text-xs font-mono text-muted-foreground">
            <span>O: <span className="text-foreground">${hoveredCandle.open.toLocaleString()}</span></span>
            <span>H: <span className="text-success">${hoveredCandle.high.toLocaleString()}</span></span>
            <span>L: <span className="text-destructive">${hoveredCandle.low.toLocaleString()}</span></span>
            <span>C: <span className="text-foreground">${hoveredCandle.close.toLocaleString()}</span></span>
          </div>
        )}
      </div>

      {/* Main Chart */}
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight + (showVolume ? volumeHeight + 20 : 0)}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="volumeGradientBull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="volumeGradientBear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="bollingerFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 1, 2, 3, 4].map((i) => {
          const price = minPrice - pricePadding + ((priceRange + 2 * pricePadding) / 4) * i;
          const y = priceToY(price);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="hsl(var(--chart-grid))"
                strokeWidth="1"
                strokeDasharray="4,4"
                opacity="0.5"
              />
              <text
                x={chartWidth - padding.right + 8}
                y={y + 4}
                fill="hsl(var(--muted-foreground))"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                ${price.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Bollinger Bands */}
        {bollinger && (
          <>
            <path
              d={createLinePath(bollinger.upper)}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d={createLinePath(bollinger.lower)}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              opacity="0.5"
            />
            <path
              d={createLinePath(bollinger.middle)}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0.5"
            />
          </>
        )}

        {/* Candlesticks */}
        {data.map((candle, i) => {
          const x = padding.left + i * candleWidth + candleGap / 2;
          const isBullish = candle.close >= candle.open;
          const bodyTop = priceToY(Math.max(candle.open, candle.close));
          const bodyBottom = priceToY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(1, bodyBottom - bodyTop);

          return (
            <g 
              key={i}
              onMouseEnter={() => setHoveredCandle(candle)}
              onMouseLeave={() => setHoveredCandle(null)}
              style={{ cursor: 'crosshair' }}
            >
              {/* Wick */}
              <line
                x1={x + actualCandleWidth / 2}
                y1={priceToY(candle.high)}
                x2={x + actualCandleWidth / 2}
                y2={priceToY(candle.low)}
                stroke={isBullish ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={actualCandleWidth}
                height={bodyHeight}
                fill={isBullish ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                rx="1"
              />
            </g>
          );
        })}

        {/* SMA Line */}
        {sma20.length > 0 && (
          <path
            d={createLinePath(sma20)}
            fill="none"
            stroke="hsl(var(--warning))"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}

        {/* EMA Line */}
        {ema12.length > 0 && (
          <path
            d={createLinePath(ema12)}
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="1.5"
            opacity="0.8"
          />
        )}

        {/* Volume Bars */}
        {showVolume && (
          <g transform={`translate(0, ${chartHeight + 20})`}>
            {data.map((candle, i) => {
              const x = padding.left + i * candleWidth + candleGap / 2;
              const isBullish = candle.close >= candle.open;
              const height = volumeToHeight(candle.volume);

              return (
                <rect
                  key={i}
                  x={x}
                  y={volumeHeight - height}
                  width={actualCandleWidth}
                  height={height}
                  fill={isBullish ? "url(#volumeGradientBull)" : "url(#volumeGradientBear)"}
                  rx="1"
                />
              );
            })}
          </g>
        )}

        {/* Current Price Line */}
        <line
          x1={padding.left}
          y1={priceToY(latestCandle.close)}
          x2={chartWidth - padding.right}
          y2={priceToY(latestCandle.close)}
          stroke={priceChange >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
          strokeWidth="1"
          strokeDasharray="4,2"
        />
        <rect
          x={chartWidth - padding.right}
          y={priceToY(latestCandle.close) - 10}
          width="55"
          height="20"
          rx="3"
          fill={priceChange >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
        />
        <text
          x={chartWidth - padding.right + 5}
          y={priceToY(latestCandle.close) + 4}
          fill="hsl(var(--background))"
          fontSize="10"
          fontWeight="600"
          fontFamily="JetBrains Mono, monospace"
        >
          ${latestCandle.close.toFixed(0)}
        </text>
      </svg>
    </div>
  );
}
