export interface Strategy {
  id: string;
  author: {
    name: string;
    avatar: string;
    badge?: string;
  };
  title: string;
  description: string;
  riskScore: number;
  roi: number;
  timeframe: string;
  copiedCount: number;
  createdAt: string;
  tags: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  roi: number;
  isPropCertified: boolean;
}

export interface PortfolioData {
  balance: number;
  change: number;
  changePercent: number;
  sparklineData: number[];
}

export const mockStrategies: Strategy[] = [
  {
    id: "1",
    author: {
      name: "AlgoWizard",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlgoWizard",
      badge: "Pro Trader",
    },
    title: "Golden Cross BTC Strategy",
    description: "Automated entry when 50 EMA crosses above 200 EMA on 4H timeframe. Includes trailing stop-loss and take-profit levels.",
    riskScore: 85,
    roi: 24.5,
    timeframe: "4H",
    copiedCount: 1247,
    createdAt: "2h ago",
    tags: ["BTC", "Momentum", "EMA"],
  },
  {
    id: "2",
    author: {
      name: "CryptoSage",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoSage",
      badge: "Verified",
    },
    title: "ETH RSI Divergence Hunter",
    description: "Spots hidden bullish divergences on RSI. Perfect for catching reversals on ETH/USDT pair.",
    riskScore: 62,
    roi: 18.2,
    timeframe: "1H",
    copiedCount: 892,
    createdAt: "5h ago",
    tags: ["ETH", "RSI", "Reversal"],
  },
  {
    id: "3",
    author: {
      name: "RiskMaster",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiskMaster",
    },
    title: "High-Volatility Scalper",
    description: "Quick entries during high volatility events. Uses ATR for dynamic position sizing and exits.",
    riskScore: 32,
    roi: 45.8,
    timeframe: "15M",
    copiedCount: 2341,
    createdAt: "1d ago",
    tags: ["Scalping", "ATR", "High-Risk"],
  },
  {
    id: "4",
    author: {
      name: "TrendFollower",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TrendFollower",
      badge: "Top 10",
    },
    title: "Multi-Asset Trend Rider",
    description: "Follows major trends across BTC, ETH, and SOL. Low drawdown with consistent returns over time.",
    riskScore: 78,
    roi: 31.2,
    timeframe: "1D",
    copiedCount: 3102,
    createdAt: "3d ago",
    tags: ["Multi-Asset", "Trend", "Low-Risk"],
  },
];

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "QuantKing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=QuantKing",
    roi: 156.4,
    isPropCertified: true,
  },
  {
    rank: 2,
    name: "AlphaTrader",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlphaTrader",
    roi: 134.2,
    isPropCertified: false,
  },
  {
    rank: 3,
    name: "CryptoNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CryptoNinja",
    roi: 128.9,
    isPropCertified: true,
  },
];

export const mockPortfolio: PortfolioData = {
  balance: 100000,
  change: 2450,
  changePercent: 2.45,
  sparklineData: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85, 90, 88, 95, 100],
};

export const navigationItems = [
  { name: "Home", icon: "Home", path: "/" },
  { name: "Community", icon: "Users", path: "/community" },
  { name: "Charts", icon: "LineChart", path: "/charts" },
  { name: "Contests", icon: "Trophy", path: "/contests" },
  { name: "Learn", icon: "GraduationCap", path: "/learn" },
];
