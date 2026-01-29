import { MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AIHelperButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Tooltip */}
      <div
        className={cn(
          "absolute bottom-full right-0 mb-2 w-52 rounded-lg glass-card p-3 transition-all duration-200",
          isHovered ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0"
        )}
      >
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Need help?</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              I can help you place trades or create strategies
            </p>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex h-12 w-12 items-center justify-center rounded-full btn-gradient-premium shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-5 w-5 text-white" />
      </button>
    </div>
  );
}