import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, Activity, Minus, ChevronDown, ChevronUp, X } from "lucide-react";

interface IndicatorsPanelProps {
  activeIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
}

interface Indicator {
  id: string;
  name: string;
  shortName: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

const indicators: Indicator[] = [
  {
    id: 'SMA',
    name: 'Simple Moving Average',
    shortName: 'SMA 20',
    description: '20-period moving average showing trend direction',
    color: 'text-warning',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'EMA',
    name: 'Exponential Moving Average',
    shortName: 'EMA 12',
    description: '12-period EMA with faster response to price changes',
    color: 'text-secondary',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'BB',
    name: 'Bollinger Bands',
    shortName: 'BB 20,2',
    description: 'Shows volatility with upper and lower bands',
    color: 'text-accent',
    icon: <Minus className="w-4 h-4" />,
  },
  {
    id: 'RSI',
    name: 'Relative Strength Index',
    shortName: 'RSI 14',
    description: 'Momentum oscillator measuring overbought/oversold',
    color: 'text-primary',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'MACD',
    name: 'MACD',
    shortName: 'MACD 12,26,9',
    description: 'Trend-following momentum indicator',
    color: 'text-success',
    icon: <TrendingUp className="w-4 h-4" />,
  },
];

export function IndicatorsPanel({ activeIndicators, onToggleIndicator }: IndicatorsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Indicators</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {activeIndicators.length} active
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Active Indicators Pills */}
      {activeIndicators.length > 0 && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {activeIndicators.map((id) => {
            const indicator = indicators.find((i) => i.id === id);
            if (!indicator) return null;
            return (
              <span
                key={id}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/50 text-xs font-medium ${indicator.color}`}
              >
                {indicator.shortName}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleIndicator(id);
                  }}
                  className="hover:bg-muted rounded p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Indicator List */}
      {isExpanded && (
        <div className="border-t border-border/50">
          {indicators.map((indicator) => {
            const isActive = activeIndicators.includes(indicator.id);
            return (
              <div
                key={indicator.id}
                className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors border-b border-border/30 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${indicator.color}`}>
                    {indicator.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {indicator.name}
                      </span>
                      <span className={`text-xs ${indicator.color}`}>
                        {indicator.shortName}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {indicator.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isActive}
                  onCheckedChange={() => onToggleIndicator(indicator.id)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
