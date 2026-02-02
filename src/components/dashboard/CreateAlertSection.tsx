import { useState } from "react";
import { Bell, Sparkles, ClipboardPaste, AlertTriangle, TrendingUp, Target, Gauge, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

export function CreateAlertSection() {
  const [strategy, setStrategy] = useState("");
  const [insights, setInsights] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [alertEnabled, setAlertEnabled] = useState(false);
  const { toast } = useToast();

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setStrategy(text);
      toast({
        title: "Strategy pasted",
        description: "Strategy copied from clipboard successfully.",
      });
    } catch {
      toast({
        title: "Paste failed",
        description: "Could not access clipboard. Please paste manually.",
        variant: "destructive",
      });
    }
  };

  const analyzeStrategy = async () => {
    if (!strategy.trim()) {
      toast({
        title: "Strategy required",
        description: "Please describe your trading strategy first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setInsights("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-strategy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ strategy }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to analyze strategy");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              setInsights(fullContent);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Could not analyze strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const enableAlert = () => {
    setAlertEnabled(true);
    toast({
      title: "Alert enabled",
      description: "You'll be notified when market conditions match your strategy.",
    });
  };

  return (
    <div className="space-y-4">
      <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Create Strategy Alert
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              placeholder="Describe your trading strategy... e.g., 'Buy BTC when RSI drops below 30 on the 4H chart and MACD shows bullish crossover'"
              className="min-h-[100px] resize-none border-border/50 bg-background/50 pr-12 placeholder:text-muted-foreground/60"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handlePaste}
              title="Paste from clipboard"
            >
              <ClipboardPaste className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={analyzeStrategy}
              disabled={isAnalyzing || !strategy.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Strategy
                </>
              )}
            </Button>
            {insights && !alertEnabled && (
              <Button
                onClick={enableAlert}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                <Bell className="h-4 w-4" />
                Enable Alert
              </Button>
            )}
          </div>

          {alertEnabled && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3">
              <Bell className="h-4 w-4 text-primary" />
              <span className="text-sm text-foreground">
                Alert active — You'll be notified when conditions are met
              </span>
              <Badge variant="outline" className="ml-auto border-primary/50 text-primary">
                Monitoring
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {insights && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-secondary" />
              AI Strategy Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="mb-2 mt-4 flex items-center gap-2 text-base font-semibold text-foreground">
                      {String(children).includes("Risk") && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                      {String(children).includes("ROI") && <TrendingUp className="h-4 w-4 text-emerald-500" />}
                      {String(children).includes("Indicator") && <Target className="h-4 w-4 text-primary" />}
                      {String(children).includes("Condition") && <Gauge className="h-4 w-4 text-secondary" />}
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 text-sm text-muted-foreground">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="mb-2 ml-4 list-disc space-y-1 text-sm text-muted-foreground">{children}</ul>
                  ),
                  li: ({ children }) => <li>{children}</li>,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                }}
              >
                {insights}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        💡 Tip: Copy a strategy from the feed and paste it here to learn from top traders
      </p>
    </div>
  );
}
