import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, Activity, Minus, ChevronDown, ChevronUp, X, BarChart3 } from "lucide-react";

interface IndicatorsPanelProps {
  activeIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
}

interface Indicator {
  id: string;
  name: string;
  shortName: string;
  description: string;
  colorClass: string;
  dotColor: string;
  icon: React.ReactNode;
}

const indicators: Indicator[] = [
  {
    id: 'SMA',
    name: 'Simple Moving Average',
    shortName: 'SMA 20',
    description: '20-period trend direction',
    colorClass: 'text-warning',
    dotColor: 'bg-warning',
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    id: 'EMA',
    name: 'Exponential Moving Avg',
    shortName: 'EMA 12',
    description: 'Fast response to changes',
    colorClass: 'text-secondary',
    dotColor: 'bg-secondary',
    icon: <Activity className="w-4 h-4" />,
  },
  {
    id: 'BB',
    name: 'Bollinger Bands',
    shortName: 'BB 20,2',
    description: 'Volatility indicator',
    colorClass: 'text-accent',
    dotColor: 'bg-accent',
    icon: <Minus className="w-4 h-4" />,
  },
  {
    id: 'RSI',
    name: 'RSI',
    shortName: 'RSI 14',
    description: 'Overbought/oversold levels',
    colorClass: 'text-primary',
    dotColor: 'bg-primary',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'MACD',
    name: 'MACD',
    shortName: '12,26,9',
    description: 'Momentum indicator',
    colorClass: 'text-success',
    dotColor: 'bg-success',
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
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors border-b border-border/30"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-semibold text-foreground">Indicators</span>
          {activeIndicators.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary font-semibold">
              {activeIndicators.length}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Active Indicators Pills */}
      {activeIndicators.length > 0 && (
        <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-border/30 bg-muted/10">
          {activeIndicators.map((id) => {
            const indicator = indicators.find((i) => i.id === id);
            if (!indicator) return null;
            return (
              <span
                key={id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 text-xs font-semibold border border-border/50 ${indicator.colorClass}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${indicator.dotColor}`} />
                {indicator.shortName}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleIndicator(id);
                  }}
                  className="hover:bg-muted rounded p-0.5 ml-0.5 transition-colors"
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
        <div>
          {indicators.map((indicator, index) => {
            const isActive = activeIndicators.includes(indicator.id);
            return (
              <div
                key={indicator.id}
                className={`flex items-center justify-between px-5 py-3.5 hover:bg-muted/15 transition-all border-b border-border/20 last:border-b-0 ${
                  isActive ? 'bg-muted/10' : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted/50 ${indicator.colorClass}`}>
                    {indicator.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">
                        {indicator.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs font-mono font-semibold ${indicator.colorClass}`}>
                        {indicator.shortName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {indicator.description}
                      </span>
                    </div>
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