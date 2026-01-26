import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  Users, MessageSquare, TrendingUp, Award, Search, 
  Filter, ChevronDown, Heart, MessageCircle, Share2,
  Flame, Clock, Star, Crown
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
  {
    id: "1",
    name: "CryptoKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoKing",
    badge: "Top Trader",
    followers: 15420,
    winRate: 78.5,
    totalPnL: 245000,
    isFollowing: false,
  },
  {
    id: "2",
    name: "AlphaWhale",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaWhale",
    badge: "Pro",
    followers: 12890,
    winRate: 72.3,
    totalPnL: 189000,
    isFollowing: true,
  },
  {
    id: "3",
    name: "TrendMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TrendMaster",
    followers: 9840,
    winRate: 68.9,
    totalPnL: 156000,
    isFollowing: false,
  },
  {
    id: "4",
    name: "SwingTrader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SwingTrader",
    badge: "Verified",
    followers: 8230,
    winRate: 71.2,
    totalPnL: 134000,
    isFollowing: false,
  },
];

const mockDiscussions: Discussion[] = [
  {
    id: "1",
    author: {
      name: "MarketSage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarketSage",
      badge: "Analyst",
    },
    title: "BTC forming a massive bull flag on the weekly chart",
    content: "Looking at the current structure, we're seeing a clear consolidation pattern that typically precedes major breakouts. Key levels to watch: $72k resistance and $65k support. What's your take?",
    likes: 342,
    comments: 89,
    shares: 45,
    createdAt: "2h ago",
    tags: ["BTC", "Technical Analysis", "Bullish"],
    isLiked: false,
  },
  {
    id: "2",
    author: {
      name: "DeFiExpert",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DeFiExpert",
      badge: "Pro",
    },
    title: "ETH staking rewards just hit a new high",
    content: "With the recent network upgrades, staking APY has increased significantly. This could drive more institutional interest. Here's my analysis on what this means for ETH price action...",
    likes: 256,
    comments: 67,
    shares: 32,
    createdAt: "4h ago",
    tags: ["ETH", "DeFi", "Staking"],
    isLiked: true,
  },
  {
    id: "3",
    author: {
      name: "RiskManager",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiskManager",
    },
    title: "Position sizing strategy that saved my portfolio",
    content: "After years of trading, I've developed a risk management framework that has consistently protected my capital during drawdowns. Never risk more than 2% per trade, and here's why...",
    likes: 567,
    comments: 134,
    shares: 89,
    createdAt: "8h ago",
    tags: ["Risk Management", "Education", "Strategy"],
    isLiked: false,
  },
  {
    id: "4",
    author: {
      name: "AltcoinHunter",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AltcoinHunter",
      badge: "Top 10",
    },
    title: "SOL ecosystem growth is underrated",
    content: "The development activity on Solana has been incredible. New protocols launching daily, TVL growing steadily. Here are the top 5 projects I'm watching closely...",
    likes: 423,
    comments: 98,
    shares: 56,
    createdAt: "12h ago",
    tags: ["SOL", "Altcoins", "Research"],
    isLiked: false,
  },
];

type TabType = "feed" | "traders" | "trending";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("feed");
  const [traders, setTraders] = useState(mockTraders);
  const [discussions, setDiscussions] = useState(mockDiscussions);

  const handleFollow = (traderId: string) => {
    setTraders(prev => 
      prev.map(t => 
        t.id === traderId ? { ...t, isFollowing: !t.isFollowing } : t
      )
    );
  };

  const handleLike = (discussionId: string) => {
    setDiscussions(prev =>
      prev.map(d =>
        d.id === discussionId 
          ? { ...d, isLiked: !d.isLiked, likes: d.isLiked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Community</h1>
                <p className="text-xs text-muted-foreground">Connect with 12,847 traders</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-muted/30 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  className="w-64 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <Button variant="outline" size="sm" className="gap-2 border-white/10">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-6 pb-3">
            <button
              onClick={() => setActiveTab("feed")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                activeTab === "feed"
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <MessageSquare className="h-4 w-4" />
              Discussions
            </button>
            <button
              onClick={() => setActiveTab("traders")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                activeTab === "traders"
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Award className="h-4 w-4" />
              Top Traders
            </button>
            <button
              onClick={() => setActiveTab("trending")}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                activeTab === "trending"
                  ? "bg-primary/10 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Flame className="h-4 w-4" />
              Trending
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="mx-auto max-w-6xl">
            {activeTab === "feed" && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Feed */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Create Post */}
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30" />
                      <input
                        type="text"
                        placeholder="Share your market insights..."
                        className="flex-1 rounded-lg border border-white/10 bg-muted/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                      />
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Post
                      </Button>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                        <Flame className="h-3.5 w-3.5" />
                        Hot
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/5">
                        <Clock className="h-3.5 w-3.5" />
                        New
                      </button>
                      <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-white/5">
                        <Star className="h-3.5 w-3.5" />
                        Top
                      </button>
                    </div>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                      This Week
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Discussion Posts */}
                  {discussions.map((discussion) => (
                    <article key={discussion.id} className="glass-card-hover p-5">
                      <div className="flex items-start gap-3">
                        <img
                          src={discussion.author.avatar}
                          alt={discussion.author.name}
                          className="h-10 w-10 rounded-full ring-2 ring-white/10"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">{discussion.author.name}</span>
                            {discussion.author.badge && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                {discussion.author.badge}
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">• {discussion.createdAt}</span>
                          </div>
                          
                          <h3 className="mt-2 text-lg font-semibold text-foreground">
                            {discussion.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {discussion.content}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {discussion.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-muted/50 px-2 py-1 text-xs font-medium text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 flex items-center gap-4">
                            <button
                              onClick={() => handleLike(discussion.id)}
                              className={cn(
                                "flex items-center gap-1.5 text-sm transition-colors",
                                discussion.isLiked ? "text-destructive" : "text-muted-foreground hover:text-destructive"
                              )}
                            >
                              <Heart className={cn("h-4 w-4", discussion.isLiked && "fill-current")} />
                              {discussion.likes}
                            </button>
                            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                              <MessageCircle className="h-4 w-4" />
                              {discussion.comments}
                            </button>
                            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                              <Share2 className="h-4 w-4" />
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
                  {/* Top Traders Mini */}
                  <div className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Top Traders</h3>
                      <button 
                        onClick={() => setActiveTab("traders")}
                        className="text-xs text-primary hover:underline"
                      >
                        View All
                      </button>
                    </div>
                    <div className="mt-4 space-y-3">
                      {traders.slice(0, 3).map((trader, idx) => (
                        <div key={trader.id} className="flex items-center gap-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/50 text-xs font-bold text-muted-foreground">
                            {idx + 1}
                          </span>
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="h-8 w-8 rounded-full ring-2 ring-white/10"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{trader.name}</p>
                            <p className="text-xs text-primary">+{trader.winRate}% win rate</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Trending Tags */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold text-foreground">Trending Topics</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["BTC", "ETH", "SOL", "DeFi", "NFTs", "Trading", "Technical Analysis", "Altcoins"].map((tag) => (
                        <button
                          key={tag}
                          className="rounded-lg bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Community Stats */}
                  <div className="glass-card p-4">
                    <h3 className="font-semibold text-foreground">Community Stats</h3>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">12.8K</p>
                        <p className="text-xs text-muted-foreground">Active Traders</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">3.2K</p>
                        <p className="text-xs text-muted-foreground">Strategies</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-primary">$2.4M</p>
                        <p className="text-xs text-muted-foreground">Total Volume</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">892</p>
                        <p className="text-xs text-muted-foreground">Online Now</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "traders" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {traders.map((trader, idx) => (
                  <div key={trader.id} className="glass-card-hover p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={trader.avatar}
                            alt={trader.name}
                            className="h-14 w-14 rounded-full ring-2 ring-white/10"
                          />
                          {idx < 3 && (
                            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                              {idx + 1}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{trader.name}</span>
                            {trader.badge && (
                              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                                <Crown className="h-3 w-3" />
                                {trader.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{trader.followers.toLocaleString()} followers</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="mt-1 text-lg font-bold text-primary">{trader.winRate}%</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 p-3">
                        <p className="text-xs text-muted-foreground">Total P&L</p>
                        <p className="mt-1 text-lg font-bold text-primary">+${(trader.totalPnL / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant={trader.isFollowing ? "outline" : "default"}
                        size="sm"
                        className={cn(
                          "flex-1",
                          trader.isFollowing 
                            ? "border-white/10 hover:bg-white/5" 
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                        onClick={() => handleFollow(trader.id)}
                      >
                        {trader.isFollowing ? "Following" : "Follow"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 border-white/10 hover:bg-white/5">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "trending" && (
              <div className="space-y-4">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Trending Now</h2>
                      <p className="text-sm text-muted-foreground">Most discussed topics in the last 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {[
                    { topic: "Bitcoin ETF Inflows", mentions: 1247, trend: "+45%", sentiment: "bullish" },
                    { topic: "Ethereum Merge Anniversary", mentions: 892, trend: "+23%", sentiment: "neutral" },
                    { topic: "Solana DeFi Growth", mentions: 756, trend: "+67%", sentiment: "bullish" },
                    { topic: "Altcoin Season Predictions", mentions: 634, trend: "+12%", sentiment: "mixed" },
                  ].map((item, idx) => (
                    <div key={idx} className="glass-card-hover p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-2xl font-bold text-muted-foreground">#{idx + 1}</span>
                          <h3 className="mt-1 text-lg font-semibold text-foreground">{item.topic}</h3>
                        </div>
                        <span className={cn(
                          "rounded-full px-2 py-1 text-xs font-medium",
                          item.sentiment === "bullish" ? "bg-primary/10 text-primary" :
                          item.sentiment === "neutral" ? "bg-muted/50 text-muted-foreground" :
                          "bg-secondary/10 text-secondary"
                        )}>
                          {item.sentiment}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MessageSquare className="h-4 w-4" />
                          {item.mentions.toLocaleString()} mentions
                        </div>
                        <span className="text-sm font-medium text-primary">{item.trend}</span>
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
