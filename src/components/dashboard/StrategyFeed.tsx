import { CreateStrategyInput } from "./CreateStrategyInput";
import { StrategyCard } from "./StrategyCard";
import { mockStrategies } from "@/data/mockData";

export function StrategyFeed() {
  return (
    <div className="flex flex-col gap-6">
      <CreateStrategyInput />
      
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Community Strategies</h2>
        <div className="flex gap-2">
          <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20">
            Trending
          </button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            Latest
          </button>
          <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground">
            Top ROI
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {mockStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}
