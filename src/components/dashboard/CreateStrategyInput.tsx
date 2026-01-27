import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CreateStrategyInput() {
  const [input, setInput] = useState("");

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <span className="text-sm font-medium">You</span>
        </div>
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your trading strategy..."
              className="w-full rounded border border-border bg-muted/50 px-3 py-2.5 pr-28 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 gap-1.5 px-2 text-secondary hover:bg-secondary/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="text-xs">Generate</span>
              </Button>
            </div>
          </div>
        </div>
        <Button size="icon" className="h-9 w-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Example: "Buy BTC when RSI drops below 30 on the 4H chart"
      </p>
    </div>
  );
}