import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number;
  size?: "sm" | "md";
}

export function RiskGauge({ score, size = "sm" }: RiskGaugeProps) {
  const isLowRisk = score >= 70;
  const isMediumRisk = score >= 40 && score < 70;
  
  const getColor = () => {
    if (isLowRisk) return "text-primary";
    if (isMediumRisk) return "text-warning";
    return "text-destructive";
  };

  const getLabel = () => {
    if (isLowRisk) return "Safe";
    if (isMediumRisk) return "Moderate";
    return "Risky";
  };

  const getBgColor = () => {
    if (isLowRisk) return "from-primary/20 to-primary/5";
    if (isMediumRisk) return "from-warning/20 to-warning/5";
    return "from-destructive/20 to-destructive/5";
  };

  const getStrokeColor = () => {
    if (isLowRisk) return "stroke-primary";
    if (isMediumRisk) return "stroke-warning";
    return "stroke-destructive";
  };

  const circumference = 2 * Math.PI * 18;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimensions = size === "sm" ? "h-12 w-12" : "h-16 w-16";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("relative flex items-center justify-center", dimensions)}>
      {/* Background glow */}
      <div className={cn("absolute inset-0 rounded-full bg-gradient-radial opacity-50", getBgColor())} />
      
      {/* SVG Gauge */}
      <svg className="h-full w-full -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          strokeWidth="3"
          className="stroke-muted/30"
        />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-500", getStrokeColor())}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-bold leading-none", textSize, getColor())}>
          {score}%
        </span>
        {size === "md" && (
          <span className={cn("text-[10px] font-medium", getColor())}>
            {getLabel()}
          </span>
        )}
      </div>
    </div>
  );
}
