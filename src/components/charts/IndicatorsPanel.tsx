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
  icon: React.ReactNode;
}

const indicators: Indicator[] = [
  { id: 'SMA', name: 'Simple Moving Average', shortName: 'SMA 20', description: '20-period trend', colorClass: 'text-secondary', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: 'EMA', name: 'Exponential Moving Avg', shortName: 'EMA 12', description: 'Fast response', colorClass: 'text-accent', icon: <Activity className="w-3.5 h-3.5" /> },
  { id: 'BB', name: 'Bollinger Bands', shortName: 'BB 20,2', description: 'Volatility', colorClass: 'text-secondary', icon: <Minus className="w-3.5 h-3.5" /> },
  { id: 'RSI', name: 'RSI', shortName: 'RSI 14', description: 'Overbought/oversold', colorClass: 'text-primary', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: 'MACD', name: 'MACD', shortName: '12,26,9', description: 'Momentum', colorClass: 'text-primary', icon: <TrendingUp className="w-3.5 h-3.5" /> },
];

export function IndicatorsPanel({ activeIndicators, onToggleIndicator }: IndicatorsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border/60"
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Indicators</span>
          {activeIndicators.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {activeIndicators.length}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      {/* Active Pills */}
      {activeIndicators.length > 0 && (
        <div className="px-3 py-2 flex flex-wrap gap-1.5 border-b border-border/40 bg-muted/20">
          {activeIndicators.map((id) => {
            const indicator = indicators.find((i) => i.id === id);
            if (!indicator) return null;
            return (
              <span key={id} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-muted text-xs font-medium ${indicator.colorClass}`}>
                {indicator.shortName}
                <button onClick={(e) => { e.stopPropagation(); onToggleIndicator(id); }} className="hover:bg-muted rounded p-0.5">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* List */}
      {isExpanded && (
        <div className="divide-y divide-border/40">
          {indicators.map((indicator) => {
            const isActive = activeIndicators.includes(indicator.id);
            return (
              <div key={indicator.id} className={`flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors ${isActive ? 'bg-muted/10' : ''}`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded bg-muted/50 ${indicator.colorClass}`}>{indicator.icon}</div>
                  <div>
                    <span className="text-xs font-medium text-foreground">{indicator.name}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] font-mono ${indicator.colorClass}`}>{indicator.shortName}</span>
                      <span className="text-[10px] text-muted-foreground">{indicator.description}</span>
                    </div>
                  </div>
                </div>
                <Switch checked={isActive} onCheckedChange={() => onToggleIndicator(indicator.id)} className="scale-90 data-[state=checked]:bg-primary" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}