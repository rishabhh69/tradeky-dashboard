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

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  icon: string;
}

export interface Position {
  id: string;
  asset: string;
  type: 'long' | 'short';
  entryPrice: number;
  currentPrice: number;
  size: number;
  pnl: number;
  pnlPercent: number;
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
  change: 735,
  changePercent: 2.45,
  sparklineData: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85, 90, 88, 95, 100],
};

export const mockMarketAssets: MarketAsset[] = [
  { symbol: "BTC", name: "Bitcoin", price: 67432.50, change24h: 2.34, volume24h: 28500000000, icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 3456.78, change24h: -0.56, volume24h: 15200000000, icon: "Ξ" },
  { symbol: "SOL", name: "Solana", price: 178.92, change24h: 5.67, volume24h: 3400000000, icon: "◎" },
  { symbol: "BNB", name: "BNB", price: 598.34, change24h: 1.23, volume24h: 1800000000, icon: "⬡" },
  { symbol: "XRP", name: "Ripple", price: 0.5234, change24h: -1.45, volume24h: 2100000000, icon: "✕" },
];

// Generate mock candlestick data
export const generateCandleData = (days: number = 100): CandleData[] => {
  const data: CandleData[] = [];
  let basePrice = 67000;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  for (let i = days; i >= 0; i--) {
    const volatility = 0.02;
    const trend = Math.sin(i / 10) * 0.005;
    
    const open = basePrice;
    const change = (Math.random() - 0.5 + trend) * volatility * basePrice;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * 0.01 * basePrice;
    const low = Math.min(open, close) - Math.random() * 0.01 * basePrice;
    const volume = Math.floor(Math.random() * 5000000000 + 1000000000);

    data.push({
      time: new Date(now - i * oneDay).toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume,
    });

    basePrice = close;
  }

  return data;
};

export const mockPositions: Position[] = [
  {
    id: "1",
    asset: "BTC",
    type: "long",
    entryPrice: 65800,
    currentPrice: 67432.50,
    size: 0.15,
    pnl: 244.88,
    pnlPercent: 2.48,
  },
  {
    id: "2",
    asset: "ETH",
    type: "long",
    entryPrice: 3380,
    currentPrice: 3456.78,
    size: 2.5,
    pnl: 191.95,
    pnlPercent: 2.27,
  },
];

export const navigationItems = [
  { name: "Home", icon: "Home", path: "/" },
  { name: "Community", icon: "Users", path: "/community" },
  { name: "Charts", icon: "LineChart", path: "/charts" },
  { name: "Contests", icon: "Trophy", path: "/contests" },
  { name: "Learn", icon: "GraduationCap", path: "/learn" },
];
