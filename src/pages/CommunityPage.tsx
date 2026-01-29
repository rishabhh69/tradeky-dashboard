import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  Users, MessageSquare, TrendingUp, Search, 
  Filter, Heart, MessageCircle, Share2,
  Flame, Clock, Star, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Trader {
  id: string;
  name: string;
  avatar: string;
  badge?: string;
  followers: number;
  winRate: number;
  totalPnL: number;
  isFollowing: boolean;
}

interface Discussion {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  title: string;
  content: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  tags: string[];
  isLiked: boolean;
}

const mockTraders: Trader[] = [
  { id: "1", name: "CryptoKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing", badge: "Top Trader", followers: 15420, winRate: 78.5, totalPnL: 245000, isFollowing: false },
  { id: "2", name: "AlphaWhale", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaWhale", badge: "Pro", followers: 12890, winRate: 72.3, totalPnL: 189000, isFollowing: true },
  { id: "3", name: "TrendMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TrendMaster", followers: 9840, winRate: 68.9, totalPnL: 156000, isFollowing: false },
  { id: "4", name: "SwingTrader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SwingTrader", badge: "Verified", followers: 8230, winRate: 71.2, totalPnL: 134000, isFollowing: false },
];

const mockDiscussions: Discussion[] = [
  { id: "1", author: { name: "MarketSage", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarketSage", badge: "Analyst" }, title: "BTC forming a massive bull flag on the weekly chart", content: "Looking at the current structure, we're seeing a clear consolidation pattern that typically precedes major breakouts. Key levels to watch: $72k resistance and $65k support.", likes: 342, comments: 89, shares: 45, createdAt: "2h ago", tags: ["BTC", "Technical Analysis"], isLiked: false },
  { id: "2", author: { name: "DeFiExpert", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiExpert", badge: "Pro" }, title: "ETH staking rewards just hit a new high", content: "With the recent network upgrades, staking APY has increased significantly. This could drive more institutional interest.", likes: 256, comments: 67, shares: 32, createdAt: "4h ago", tags: ["ETH", "DeFi"], isLiked: true },
  { id: "3", author: { name: "RiskManager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiskManager" }, title: "Position sizing strategy that saved my portfolio", content: "After years of trading, I've developed a risk management framework that has consistently protected my capital during drawdowns.", likes: 567, comments: 134, shares: 89, createdAt: "8h ago", tags: ["Risk Management", "Education"], isLiked: false },
];

type TabType = "feed" | "traders" | "trending";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [traders, setTraders] = useState(mockTraders);
  const [discussions, setDiscussions] = useState(mockDiscussions);

  const handleFollow = (traderId: string) => {
    setTraders(prev => prev.map(t => t.id === traderId ? { ...t, isFollowing: !t.isFollowing } : t));
  };

  const handleLike = (discussionId: string) => {
    setDiscussions(prev => prev.map(d => d.id === discussionId ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 } : d));
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <Sidebar />
      
      <div className="pl-60">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <h1 className="text-base font-semibold text-foreground">Community</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg glass-card px-3 py-1.5">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-48 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 h-8 border-white/10 hover:bg-white/5 text-xs">
                <Filter className="h-3.5 w-3.5" />
                Filter
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-5 pb-3">
            {[
              { key: 'feed', label: 'Discussions', icon: MessageSquare },
              { key: 'traders', label: 'Top Traders', icon: TrendingUp },
              { key: 'trending', label: 'Trending', icon: Flame },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as TabType)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  activeTab === key
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="p-5">
          <div className="mx-auto max-w-5xl">
            {activeTab === "feed" && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                {/* Main Feed */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Create Post */}
                  <div className="glass-card p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                      <input
                        type="text"
                        placeholder="Share your market insights..."
                        className="flex-1 rounded-lg glass-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                      <Button size="sm" className="h-8 px-3 text-xs btn-primary-premium">Post</Button>
                    </div>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-1">
                    {[
                      { label: 'Hot', icon: Flame },
                      { label: 'New', icon: Clock },
                      { label: 'Top', icon: Star },
                    ].map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        className={cn(
                          "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-all",
                          label === 'Hot' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5"
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Posts */}
                  {discussions.map((discussion) => (
                    <article key={discussion.id} className="glass-card p-4">
                      <div className="flex items-start gap-3">
                        <img src={discussion.author.avatar} alt="" className="h-8 w-8 rounded-full bg-card" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">{discussion.author.name}</span>
                            {discussion.author.badge && (
                              <span className="badge-fuchsia">
                                {discussion.author.badge}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">• {discussion.createdAt}</span>
                          </div>
                          
                          <h3 className="mt-1.5 text-sm font-medium text-foreground">{discussion.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{discussion.content}</p>

                          <div className="mt-2 flex flex-wrap gap-1">
                            {discussion.tags.map((tag) => (
                              <span key={tag} className="rounded-lg bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground border border-white/5">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <button
                              onClick={() => handleLike(discussion.id)}
                              className={cn(
                                "flex items-center gap-1 text-xs transition-colors",
                                discussion.isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                              )}
                            >
                              <Heart className={cn("h-3.5 w-3.5", discussion.isLiked && "fill-current")} />
                              {discussion.likes}
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {discussion.comments}
                            </button>
                            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                              <Share2 className="h-3.5 w-3.5" />
                              {discussion.shares}
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  {/* Top Traders */}
                  <div className="glass-card">
                    <div className="flex items-center justify-between p-3 border-b border-white/5">
                      <h3 className="text-sm font-medium text-foreground">Top Traders</h3>
                      <button onClick={() => setActiveTab("traders")} className="text-xs text-primary hover:text-primary/80 flex items-center">
                        View All <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="divide-y divide-white/5">
                      {traders.slice(0, 3).map((trader, idx) => (
                        <div key={trader.id} className="flex items-center gap-2 p-3">
                          <span className="w-5 text-xs font-medium text-muted-foreground">{idx + 1}</span>
                          <img src={trader.avatar} alt="" className="h-7 w-7 rounded-full bg-card" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{trader.name}</p>
                            <p className="text-[10px] text-primary">+{trader.winRate}% win rate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-medium text-foreground mb-3">Trending Topics</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {["BTC", "ETH", "SOL", "DeFi", "NFTs", "Trading"].map((tag) => (
                        <button
                          key={tag}
                          className="rounded-lg bg-white/5 px-2 py-1 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-white/5"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="glass-card p-3">
                    <h3 className="text-sm font-medium text-foreground mb-3">Community Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Traders', value: '12.8K' },
                        { label: 'Strategies', value: '3.2K' },
                        { label: 'Volume', value: '$2.4M' },
                        { label: 'Online', value: '892' },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-2 rounded-lg bg-white/[0.03] border border-white/5 text-center">
                          <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
                          <p className="text-[10px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "traders" && (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {traders.map((trader, idx) => (
                  <div key={trader.id} className="glass-card p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={trader.avatar} alt="" className="h-11 w-11 rounded-full bg-card" />
                          {idx < 3 && (
                            <div className={cn(
                              "absolute -right-1 -top-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                              idx === 0 ? "bg-amber-500 text-black" :
                              idx === 1 ? "bg-slate-400 text-black" :
                              "bg-orange-500 text-black"
                            )}>
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium text-foreground">{trader.name}</span>
                            {trader.badge && (
                              <span className="badge-fuchsia">
                                {trader.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{trader.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                        <p className="text-[10px] text-muted-foreground">Win Rate</p>
                        <p className="text-sm font-semibold text-primary font-mono">{trader.winRate}%</p>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] border border-white/5 p-2">
                        <p className="text-[10px] text-muted-foreground">Total P&L</p>
                        <p className="text-sm font-semibold text-primary font-mono">+${(trader.totalPnL / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <Button
                        variant={trader.isFollowing ? "outline" : "default"}
                        size="sm"
                        className={cn("flex-1 h-8 text-xs", trader.isFollowing ? "border-white/10 hover:bg-white/5" : "btn-primary-premium")}
                        onClick={() => handleFollow(trader.id)}
                      >
                        {trader.isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-white/10 hover:bg-white/5">
                        Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "trending" && (
              <div className="space-y-4">
                <div className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Trending Now</h2>
                      <p className="text-xs text-muted-foreground">Most discussed topics in the last 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {[
                    { topic: "Bitcoin ETF Inflows", mentions: 1247, trend: "+45%", sentiment: "bullish" },
                    { topic: "Ethereum Merge Anniversary", mentions: 892, trend: "+23%", sentiment: "neutral" },
                    { topic: "Solana NFT Surge", mentions: 756, trend: "+67%", sentiment: "bullish" },
                    { topic: "DeFi Yield Farming", mentions: 534, trend: "+12%", sentiment: "neutral" },
                  ].map((item, i) => (
                    <div key={i} className="glass-card p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">{item.topic}</h3>
                        <span className={cn(
                          "badge-cyan",
                          item.sentiment === "bullish" && "badge-cyan"
                        )}>
                          {item.sentiment}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">{item.mentions} mentions</span>
                        <span className="text-xs text-primary font-medium">{item.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}