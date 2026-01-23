import { MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AIHelperButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      <div
        className={cn(
          "absolute bottom-full right-0 mb-3 w-56 rounded-xl glass-card p-4 transition-all duration-300",
          isHovered
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10">
            <Sparkles className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Need help?</p>
            <p className="mt-1 text-sm text-muted-foreground">
              I can help you place a trade or create a strategy!
            </p>
          </div>
        </div>
        {/* Arrow */}
        <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 border-b border-r border-white/10 bg-card/60 backdrop-blur-xl" />
      </div>

      {/* Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-pink-500 shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl glow-secondary animate-float"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-secondary/30 animate-ping" />
        
        <MessageCircle className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
        
        {/* Notification dot */}
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
          AI
        </span>
      </button>
    </div>
  );
}
