import { CreateStrategyInput } from "./CreateStrategyInput";
import { StrategyCard } from "./StrategyCard";
import { mockStrategies } from "@/data/mockData";

export function StrategyFeed() {
  return (
    <div className="flex flex-col gap-4">
      <CreateStrategyInput />
      
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Community Strategies</h2>
        <div className="flex gap-1">
          <button className="rounded bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Trending
          </button>
          <button className="rounded px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            Latest
          </button>
          <button className="rounded px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
            Top ROI
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {mockStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>
    </div>
  );
}