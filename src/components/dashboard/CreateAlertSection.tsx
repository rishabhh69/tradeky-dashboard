import { useState, useEffect } from "react";
import { Bell, Sparkles, ClipboardPaste, AlertTriangle, TrendingUp, Target, Gauge, Loader2, Trash2, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

interface StrategyAlert {
  id: string;
  strategy_text: string;
  ai_insights: string | null;
  is_active: boolean;
  created_at: string;
}

export function CreateAlertSection() {
  const [strategy, setStrategy] = useState("");
  const [insights, setInsights] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedAlerts, setSavedAlerts] = useState<StrategyAlert[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch user's saved alerts on mount
  useEffect(() => {
    if (user) {
      fetchAlerts();
      
      // Subscribe to realtime changes
      const channel = supabase
        .channel('strategy_alerts')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'strategy_alerts',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            fetchAlerts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchAlerts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('strategy_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
    } else {
      setSavedAlerts(data || []);
    }
  };

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

  const saveAlert = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to save alerts.",
        variant: "destructive",
      });
      return;
    }

    if (!strategy.trim()) {
      toast({
        title: "Strategy required",
        description: "Please describe your trading strategy first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from('strategy_alerts').insert({
        user_id: user.id,
        strategy_text: strategy,
        ai_insights: insights || null,
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Alert saved",
        description: "Your strategy alert has been saved and is now active.",
      });

      setStrategy("");
      setInsights("");
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Save failed",
        description: "Could not save alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAlert = async (alertId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('strategy_alerts')
        .update({ is_active: !currentState })
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: currentState ? "Alert paused" : "Alert activated",
        description: currentState 
          ? "You won't receive notifications for this strategy." 
          : "You'll be notified when conditions are met.",
      });
    } catch (error) {
      console.error("Toggle error:", error);
      toast({
        title: "Update failed",
        description: "Could not update alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('strategy_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;

      toast({
        title: "Alert deleted",
        description: "Strategy alert has been removed.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Delete failed",
        description: "Could not delete alert. Please try again.",
        variant: "destructive",
      });
    }
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
            {strategy.trim() && (
              <Button
                onClick={saveAlert}
                disabled={isSaving}
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bell className="h-4 w-4" />
                )}
                Save Alert
              </Button>
            )}
          </div>
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

      {/* Saved Alerts */}
      {savedAlerts.length > 0 && (
        <Card className="border-border/50 bg-card/30 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-primary" />
              Your Strategy Alerts
              <Badge variant="outline" className="ml-auto border-primary/50 text-primary">
                {savedAlerts.filter(a => a.is_active).length} Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-3 transition-all ${
                  alert.is_active
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border/30 bg-muted/10 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">
                      {alert.strategy_text}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {new Date(alert.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => toggleAlert(alert.id, alert.is_active)}
                      title={alert.is_active ? "Pause alert" : "Activate alert"}
                    >
                      {alert.is_active ? (
                        <Power className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <PowerOff className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteAlert(alert.id)}
                      title="Delete alert"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                {alert.is_active && (
                  <Badge variant="outline" className="mt-2 border-primary/50 text-primary text-xs">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-primary animate-pulse inline-block" />
                    Monitoring
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <p className="text-center text-xs text-muted-foreground">
        💡 Tip: Copy a strategy from the feed and paste it here to learn from top traders
      </p>
    </div>
  );
}
