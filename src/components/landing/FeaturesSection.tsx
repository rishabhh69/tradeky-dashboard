import { Sparkles, Shield, Users, TrendingUp, Zap, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI Strategy Generator",
    description: "Describe your trading idea in plain English. Our AI transforms it into executable code with full backtesting.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    title: "Real-Time Risk Analysis",
    description: "Every strategy is scored by our proprietary AI risk engine. Know your exposure before you trade.",
    color: "success",
    gradient: "from-success/20 to-success/5",
  },
  {
    icon: Users,
    title: "Copy Elite Traders",
    description: "Follow top performers and mirror their strategies. Learn from the best while you earn.",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: TrendingUp,
    title: "Paper Trading Arena",
    description: "Test strategies with $100K virtual funds. Master the markets without risking a single dollar.",
    color: "primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Zap,
    title: "Lightning Execution",
    description: "Sub-10ms order execution with direct market access. Speed matters when profits are on the line.",
    color: "warning",
    gradient: "from-warning/20 to-warning/5",
  },
  {
    icon: BarChart3,
    title: "Pro Analytics Suite",
    description: "Advanced charting, heat maps, and market sentiment analysis powered by machine learning.",
    color: "accent",
    gradient: "from-accent/20 to-accent/5",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Everything You Need to
            <br />
            <span className="text-gradient-secondary">Dominate the Markets</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built by traders, for traders. Every feature is designed to give you an unfair advantage.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group relative glass-card-hover p-8"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
              
              <div className="relative z-10">
                <div 
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 transition-all duration-300
                    bg-${feature.color}/10 border border-${feature.color}/20 group-hover:scale-110 group-hover:shadow-lg`}
                  style={{
                    boxShadow: `0 0 20px hsl(var(--${feature.color}) / 0.2)`
                  }}
                >
                  <feature.icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
