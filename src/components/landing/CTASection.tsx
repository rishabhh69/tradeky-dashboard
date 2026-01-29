import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const benefits = [
  "No credit card required",
  "$100K virtual trading funds",
  "AI strategy generation included",
  "Cancel anytime",
];

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      {/* Glowing Lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8">
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Limited Time: Pro Features Free for 30 Days</span>
        </div>
        
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
          Ready to Trade Like
          <br />
          <span className="text-gradient-accent">The Top 1%?</span>
        </h2>
        
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
          Join 50,000+ traders who are already using AI to gain an edge. 
          Your journey to consistent profits starts here.
        </p>
        
        {/* Benefits */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-10">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              <span className="text-sm text-foreground/80">{benefit}</span>
            </div>
          ))}
        </div>
        
        {/* CTA Button */}
        <Link to="/auth?mode=signup">
          <Button 
            size="lg" 
            className="h-16 px-12 text-xl font-bold btn-gradient-premium group animate-glow-pulse"
          >
            Start Free Trial
            <ArrowRight className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
        
        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required · Setup in 2 minutes
        </p>
      </div>
    </section>
  );
}