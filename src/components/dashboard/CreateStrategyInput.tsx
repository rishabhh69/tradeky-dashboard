import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CreateStrategyInput() {
  const [input, setInput] = useState("");

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser"
          alt="Your avatar"
          className="h-10 w-10 rounded-full ring-2 ring-primary/30"
        />
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your trading strategy idea..."
              className="w-full rounded-lg border border-white/10 bg-muted/30 px-4 py-3 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 gap-1.5 px-3 text-secondary hover:bg-secondary/10 hover:text-secondary"
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Generate</span>
              </Button>
            </div>
          </div>
        </div>
        <Button size="icon" className="h-10 w-10 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        💡 Tip: Use natural language like "Buy BTC when RSI drops below 30 on the 4H chart"
      </p>
    </div>
  );
}
