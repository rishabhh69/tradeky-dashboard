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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartWidth = 900;
  const chartHeight = 420;
  const volumeHeight = 90;
  const padding = { top: 24, right: 70, bottom: 35, left: 12 };
  
  const candleWidth = (chartWidth - padding.left - padding.right) / data.length;
  const candleGap = candleWidth * 0.25;
  const actualCandleWidth = candleWidth - candleGap;

  const prices = data.flatMap(d => [d.high, d.low]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  const pricePadding = priceRange * 0.12;

  const maxVolume = Math.max(...data.map(d => d.volume));

  const priceToY = (price: number) => {
    return padding.top + (1 - (price - (minPrice - pricePadding)) / (priceRange + 2 * pricePadding)) * (chartHeight - padding.top - padding.bottom);
  };

  const volumeToHeight = (volume: number) => {
    return (volume / maxVolume) * volumeHeight * 0.75;
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

  // Create Bollinger Band fill path
  const createBollingerFillPath = (): string => {
    if (!bollinger) return '';
    
    const upperPath: string[] = [];
    const lowerPath: string[] = [];
    
    bollinger.upper.forEach((value, i) => {
      if (!isNaN(value)) {
        const x = padding.left + i * candleWidth + candleWidth / 2;
        const yUpper = priceToY(bollinger.upper[i]);
        const yLower = priceToY(bollinger.lower[i]);
        upperPath.push(`${upperPath.length === 0 ? 'M' : 'L'} ${x} ${yUpper}`);
        lowerPath.unshift(`L ${x} ${yLower}`);
      }
    });
    
    return upperPath.join(' ') + ' ' + lowerPath.join(' ') + ' Z';
  };

  const latestCandle = data[data.length - 1];
  const priceChange = latestCandle.close - latestCandle.open;
  const priceChangePercent = (priceChange / latestCandle.open) * 100;

  return (
    <div className="w-full">
      {/* Price Info Header */}
      <div className="flex items-center justify-between mb-5 px-5 pt-5">
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <span className="text-3xl font-bold font-mono text-foreground tracking-tight">
              ${(hoveredCandle || latestCandle).close.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                priceChange >= 0 
                  ? 'bg-success/15 text-success' 
                  : 'bg-destructive/15 text-destructive'
              }`}>
                {priceChange >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
              </span>
              <span className="text-sm text-muted-foreground">
                {priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        {hoveredCandle && (
          <div className="flex gap-5 text-xs font-mono bg-muted/30 rounded-lg px-4 py-2.5">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground mb-0.5">Open</span>
              <span className="text-foreground font-medium">${hoveredCandle.open.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground mb-0.5">High</span>
              <span className="text-success font-medium">${hoveredCandle.high.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground mb-0.5">Low</span>
              <span className="text-destructive font-medium">${hoveredCandle.low.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground mb-0.5">Close</span>
              <span className="text-foreground font-medium">${hoveredCandle.close.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main Chart */}
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight + (showVolume ? volumeHeight + 25 : 0)}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Teal Success Volume Gradient */}
          <linearGradient id="volumeGradientBull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(168 71% 50%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(168 71% 50%)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="volumeGradientBear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 72% 51%)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="hsl(0 72% 51%)" stopOpacity="0.1" />
          </linearGradient>
          {/* Trust Blue Bollinger Fill */}
          <linearGradient id="bollingerFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(199 89% 60%)" stopOpacity="0.12" />
            <stop offset="50%" stopColor="hsl(199 89% 60%)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="hsl(199 89% 60%)" stopOpacity="0.12" />
          </linearGradient>
          {/* Teal Bullish Candle */}
          <linearGradient id="candleBull" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(168 75% 55%)" />
            <stop offset="100%" stopColor="hsl(168 71% 45%)" />
          </linearGradient>
          <linearGradient id="candleBear" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0 80% 58%)" />
            <stop offset="100%" stopColor="hsl(0 72% 48%)" />
          </linearGradient>
          <filter id="candleGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="priceLineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background gradient */}
        <rect 
          x="0" 
          y="0" 
          width={chartWidth} 
          height={chartHeight + (showVolume ? volumeHeight + 25 : 0)} 
          fill="transparent" 
        />

        {/* Grid Lines */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const price = minPrice - pricePadding + ((priceRange + 2 * pricePadding) / 5) * i;
          const y = priceToY(price);
          return (
            <g key={i}>
              <line
                x1={padding.left}
                y1={y}
                x2={chartWidth - padding.right}
                y2={y}
                stroke="hsl(217 33% 20%)"
                strokeWidth="1"
                opacity="0.6"
              />
              <text
                x={chartWidth - padding.right + 10}
                y={y + 4}
                fill="hsl(220 12% 50%)"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
              >
                ${price.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Bollinger Bands Fill */}
        {bollinger && (
          <path
            d={createBollingerFillPath()}
            fill="url(#bollingerFill)"
          />
        )}

        {/* Bollinger Bands Lines */}
        {bollinger && (
          <>
            <path
              d={createLinePath(bollinger.upper)}
              fill="none"
              stroke="hsl(199 89% 65%)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d={createLinePath(bollinger.lower)}
              fill="none"
              stroke="hsl(199 89% 65%)"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <path
              d={createLinePath(bollinger.middle)}
              fill="none"
              stroke="hsl(199 89% 65%)"
              strokeWidth="1"
              strokeDasharray="6,4"
              opacity="0.4"
            />
          </>
        )}

        {/* Crosshair on hover */}
        {hoveredIndex !== null && (
          <>
            <line
              x1={padding.left + hoveredIndex * candleWidth + candleWidth / 2}
              y1={padding.top}
              x2={padding.left + hoveredIndex * candleWidth + candleWidth / 2}
              y2={chartHeight - padding.bottom}
              stroke="hsl(220 12% 45%)"
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
          const isHovered = hoveredIndex === i;

          return (
            <g 
              key={i}
              onMouseEnter={() => {
                setHoveredCandle(candle);
                setHoveredIndex(i);
              }}
              onMouseLeave={() => {
                setHoveredCandle(null);
                setHoveredIndex(null);
              }}
              style={{ cursor: 'crosshair' }}
              filter={isHovered ? "url(#candleGlow)" : undefined}
            >
              {/* Wick - Teal for bull */}
              <line
                x1={x + actualCandleWidth / 2}
                y1={priceToY(candle.high)}
                x2={x + actualCandleWidth / 2}
                y2={priceToY(candle.low)}
                stroke={isBullish ? "hsl(168 71% 50%)" : "hsl(0 72% 51%)"}
                strokeWidth={isHovered ? "2" : "1"}
                opacity={isHovered ? 1 : 0.8}
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={actualCandleWidth}
                height={bodyHeight}
                fill={isBullish ? "url(#candleBull)" : "url(#candleBear)"}
                rx="1.5"
                opacity={isHovered ? 1 : 0.9}
              />
            </g>
          );
        })}

        {/* SMA Line - Gold */}
        {sma20.length > 0 && (
          <path
            d={createLinePath(sma20)}
            fill="none"
            stroke="hsl(38 92% 50%)"
            strokeWidth="2"
            opacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* EMA Line - Trust Blue */}
        {ema12.length > 0 && (
          <path
            d={createLinePath(ema12)}
            fill="none"
            stroke="hsl(199 89% 60%)"
            strokeWidth="2"
            opacity="0.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Volume Bars */}
        {showVolume && (
          <g transform={`translate(0, ${chartHeight + 25})`}>
            <line
              x1={padding.left}
              y1="0"
              x2={chartWidth - padding.right}
              y2="0"
              stroke="hsl(217 33% 20%)"
              strokeWidth="1"
            />
            <text
              x={padding.left}
              y="-8"
              fill="hsl(220 12% 50%)"
              fontSize="9"
              fontFamily="Inter, sans-serif"
              fontWeight="500"
            >
              Volume
            </text>
            {data.map((candle, i) => {
              const x = padding.left + i * candleWidth + candleGap / 2;
              const isBullish = candle.close >= candle.open;
              const height = volumeToHeight(candle.volume);
              const isHovered = hoveredIndex === i;

              return (
                <rect
                  key={i}
                  x={x}
                  y={volumeHeight - height}
                  width={actualCandleWidth}
                  height={height}
                  fill={isBullish ? "url(#volumeGradientBull)" : "url(#volumeGradientBear)"}
                  rx="1"
                  opacity={isHovered ? 1 : 0.8}
                />
              );
            })}
          </g>
        )}

        {/* Current Price Line - Teal */}
        <g filter="url(#priceLineGlow)">
          <line
            x1={padding.left}
            y1={priceToY(latestCandle.close)}
            x2={chartWidth - padding.right}
            y2={priceToY(latestCandle.close)}
            stroke={priceChange >= 0 ? "hsl(168 71% 50%)" : "hsl(0 72% 51%)"}
            strokeWidth="1"
            strokeDasharray="6,3"
            opacity="0.8"
          />
        </g>
        <rect
          x={chartWidth - padding.right + 2}
          y={priceToY(latestCandle.close) - 11}
          width="62"
          height="22"
          rx="4"
          fill={priceChange >= 0 ? "hsl(168 71% 50%)" : "hsl(0 72% 51%)"}
        />
        <text
          x={chartWidth - padding.right + 8}
          y={priceToY(latestCandle.close) + 4}
          fill="hsl(222 47% 11%)"
          fontSize="11"
          fontWeight="600"
          fontFamily="JetBrains Mono, monospace"
        >
          ${latestCandle.close.toFixed(0)}
        </text>
      </svg>
    </div>
  );
}