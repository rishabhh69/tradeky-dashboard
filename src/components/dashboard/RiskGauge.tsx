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

  const getStrokeColor = () => {
    if (isLowRisk) return "stroke-primary";
    if (isMediumRisk) return "stroke-warning";
    return "stroke-destructive";
  };

  const circumference = 2 * Math.PI * 16;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const dimensions = size === "sm" ? "h-10 w-10" : "h-12 w-12";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className={cn("relative flex items-center justify-center", dimensions)}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          strokeWidth="2.5"
          className="stroke-muted"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-300", getStrokeColor())}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn("font-semibold font-mono", textSize, getColor())}>
          {score}
        </span>
      </div>
    </div>
  );
}