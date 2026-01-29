import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Day Trader",
    avatar: "MC",
    content: "Tradeky's AI risk scoring saved me from a catastrophic trade. The 92% risk warning was spot-on. This platform is a game-changer.",
    rating: 5,
    profit: "+127% ROI",
  },
  {
    name: "Sarah Williams",
    role: "Prop Firm Trader",
    avatar: "SW",
    content: "I went from failing prop firm challenges to passing 3 in a row. The paper trading arena prepared me for everything.",
    rating: 5,
    profit: "+$45K/month",
  },
  {
    name: "David Park",
    role: "Quant Developer",
    avatar: "DP",
    content: "The AI strategy generator understands exactly what I want. It's like having a senior quant on demand. Absolutely incredible.",
    rating: 5,
    profit: "+89% Win Rate",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[180px]" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <Star className="w-4 h-4 text-primary fill-primary" />
            <span className="text-sm font-medium text-primary">Trusted by 50,000+ Traders</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Real Traders,
            <br />
            <span className="text-gradient-primary">Real Results</span>
          </h2>
        </div>
        
        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div 
              key={i}
              className="relative glass-card p-8 group hover:border-primary/30 transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} className="w-5 h-5 text-warning fill-warning" />
                ))}
              </div>
              
              {/* Content */}
              <p className="text-foreground/90 leading-relaxed mb-8 text-lg">
                "{testimonial.content}"
              </p>
              
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-white">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-success/10 border border-success/20">
                  <span className="text-sm font-bold text-success">{testimonial.profit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}