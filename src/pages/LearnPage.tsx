import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Zap, 
  Play, 
  Clock, 
  Award,
  ChevronRight,
  BarChart3,
  Target,
  Brain,
  Coins,
  LineChart
} from "lucide-react";
import { createChart, ColorType, IChartApi, CandlestickSeries, HistogramSeries } from "lightweight-charts";

const courses = [
  {
    id: 1,
    title: "Technical Analysis Fundamentals",
    description: "Master chart patterns, indicators, and price action trading",
    duration: "4 hours",
    lessons: 12,
    level: "Beginner",
    icon: BarChart3,
    gradient: "from-primary to-primary/50",
  },
  {
    id: 2,
    title: "Risk Management Masterclass",
    description: "Learn position sizing, stop-losses, and portfolio protection",
    duration: "3 hours",
    lessons: 8,
    level: "Intermediate",
    icon: Shield,
    gradient: "from-secondary to-secondary/50",
  },
  {
    id: 3,
    title: "Algorithmic Trading Basics",
    description: "Build your first trading bot with proven strategies",
    duration: "6 hours",
    lessons: 15,
    level: "Advanced",
    icon: Zap,
    gradient: "from-amber-500 to-amber-500/50",
  },
  {
    id: 4,
    title: "Cryptocurrency Investing",
    description: "Navigate the crypto market with confidence",
    duration: "5 hours",
    lessons: 14,
    level: "Beginner",
    icon: Coins,
    gradient: "from-emerald-500 to-emerald-500/50",
  },
];

const quickTips = [
  {
    title: "The 2% Rule",
    description: "Never risk more than 2% of your portfolio on a single trade",
    icon: Target,
  },
  {
    title: "Trend is Your Friend",
    description: "Trade with the market direction, not against it",
    icon: TrendingUp,
  },
  {
    title: "Emotional Discipline",
    description: "Stick to your strategy, avoid revenge trading",
    icon: Brain,
  },
];

const articles = [
  {
    title: "Understanding Market Cycles",
    category: "Market Analysis",
    readTime: "8 min",
    featured: true,
  },
  {
    title: "How Hedge Funds Analyze Risk",
    category: "Institutional Trading",
    readTime: "12 min",
    featured: true,
  },
  {
    title: "Building a Diversified Portfolio",
    category: "Portfolio Management",
    readTime: "6 min",
    featured: false,
  },
  {
    title: "RSI and MACD: A Complete Guide",
    category: "Technical Indicators",
    readTime: "10 min",
    featured: false,
  },
];

export default function LearnPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC/USD");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(255, 255, 255, 0.6)",
      },
      grid: {
        vertLines: { color: "rgba(255, 255, 255, 0.05)" },
        horzLines: { color: "rgba(255, 255, 255, 0.05)" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "rgba(34, 211, 238, 0.4)",
          labelBackgroundColor: "rgb(34, 211, 238)",
        },
        horzLine: {
          color: "rgba(34, 211, 238, 0.4)",
          labelBackgroundColor: "rgb(34, 211, 238)",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
      },
      timeScale: {
        borderColor: "rgba(255, 255, 255, 0.1)",
        timeVisible: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        vertTouchDrag: true,
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22d3ee",
      downColor: "#d946ef",
      borderDownColor: "#d946ef",
      borderUpColor: "#22d3ee",
      wickDownColor: "#d946ef",
      wickUpColor: "#22d3ee",
    });

    // Generate realistic mock data
    const generateData = () => {
      const data = [];
      let basePrice = selectedSymbol === "BTC/USD" ? 45000 : selectedSymbol === "ETH/USD" ? 2800 : 150;
      const now = Math.floor(Date.now() / 1000);
      const oneDay = 24 * 60 * 60;

      for (let i = 90; i >= 0; i--) {
        const time = now - i * oneDay;
        const volatility = basePrice * 0.03;
        const open = basePrice + (Math.random() - 0.5) * volatility;
        const close = open + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        data.push({
          time: time as any,
          open,
          high,
          low,
          close,
        });

        basePrice = close;
      }
      return data;
    };

    candlestickSeries.setData(generateData());

    // Add volume
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "rgba(34, 211, 238, 0.3)",
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    const volumeData = [];
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;

    for (let i = 90; i >= 0; i--) {
      volumeData.push({
        time: (now - i * oneDay) as any,
        value: Math.random() * 1000000 + 500000,
        color: Math.random() > 0.5 ? "rgba(34, 211, 238, 0.5)" : "rgba(217, 70, 239, 0.5)",
      });
    }

    volumeSeries.setData(volumeData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: 300,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [selectedSymbol]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Learn</h1>
            <Badge variant="outline" className="border-secondary/50 text-secondary">
              For Investors
            </Badge>
          </div>
        </header>

        <main className="p-6 space-y-8">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-8">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
            <div className="relative z-10 max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                <Award className="h-3 w-3 mr-1" />
                Institutional-Grade Education
              </Badge>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Master the Markets Like a{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Pro Trader
                </span>
              </h2>
              <p className="text-muted-foreground mb-6">
                Access the same strategies and insights used by hedge funds and prop trading firms.
                Build your edge with our comprehensive learning platform.
              </p>
              <div className="flex gap-3">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button variant="outline" className="border-border/50">
                  View Curriculum
                </Button>
              </div>
            </div>
          </div>

          {/* Live Chart Section */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-xl overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <LineChart className="h-4 w-4 text-primary" />
                  Live Market Chart
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-500 text-xs">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                    Live
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  {["BTC/USD", "ETH/USD", "SOL/USD"].map((symbol) => (
                    <Button
                      key={symbol}
                      size="sm"
                      variant={selectedSymbol === symbol ? "default" : "outline"}
                      className={selectedSymbol === symbol 
                        ? "bg-primary/20 text-primary border-primary/30" 
                        : "border-border/50 text-muted-foreground hover:text-foreground"
                      }
                      onClick={() => setSelectedSymbol(symbol)}
                    >
                      {symbol.split("/")[0]}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={chartContainerRef} className="w-full h-[300px]" />
            </CardContent>
          </Card>

          <Tabs defaultValue="courses" className="space-y-6">
            <TabsList className="bg-card/30 border border-border/50">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="tips">Quick Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {courses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="group border-border/50 bg-card/30 backdrop-blur-xl hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${course.gradient}`}>
                          <course.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {course.title}
                            </h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </span>
                            <span>{course.lessons} lessons</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                course.level === "Beginner" 
                                  ? "border-emerald-500/50 text-emerald-500" 
                                  : course.level === "Intermediate"
                                  ? "border-amber-500/50 text-amber-500"
                                  : "border-rose-500/50 text-rose-500"
                              }`}
                            >
                              {course.level}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {articles.map((article, index) => (
                  <Card 
                    key={index}
                    className="group border-border/50 bg-card/30 backdrop-blur-xl hover:border-primary/30 transition-all cursor-pointer"
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-primary/50 text-primary text-xs">
                          {article.category}
                        </Badge>
                        {article.featured && (
                          <Badge className="bg-secondary/20 text-secondary border-secondary/30 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {article.readTime} read
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                {quickTips.map((tip, index) => (
                  <Card 
                    key={index}
                    className="border-border/50 bg-card/30 backdrop-blur-xl"
                  >
                    <CardContent className="p-5 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                        <tip.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <Card className="border-border/50 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Ready to Trade Like the Pros?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Join our community of successful traders and get access to exclusive strategies, 
                live trading signals, and institutional-grade tools.
              </p>
              <div className="flex justify-center gap-3">
                <Button className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                  Get Pro Access
                </Button>
                <Button variant="outline" className="border-border/50">
                  View Pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
