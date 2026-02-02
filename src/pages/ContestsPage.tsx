import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Timer, 
  Users, 
  TrendingUp, 
  BadgeCheck, 
  Building2, 
  Briefcase,
  Star,
  Zap,
  Target,
  ChevronRight,
  Clock,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Contest {
  id: string;
  title: string;
  description: string;
  prizePool: number;
  participants: number;
  maxParticipants: number;
  startDate: string;
  endDate: string;
  status: "live" | "upcoming" | "ended";
  difficulty: "beginner" | "intermediate" | "advanced" | "elite";
  type: "trading" | "strategy" | "risk-management";
  requirements: string[];
  propFirmPartner?: string;
}

interface TopTrader {
  rank: number;
  name: string;
  avatar: string;
  roi: number;
  winRate: number;
  badges: string[];
  isPropCertified: boolean;
  fundOffers: number;
}

interface PropFirm {
  name: string;
  logo: string;
  minRoi: number;
  minWinRate: number;
  fundSize: string;
  positions: number;
  benefits: string[];
}

const mockContests: Contest[] = [
  {
    id: "1",
    title: "Elite Trader Championship",
    description: "Compete against the best for a chance to manage institutional capital",
    prizePool: 500000,
    participants: 2847,
    maxParticipants: 5000,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "live",
    difficulty: "elite",
    type: "trading",
    requirements: ["Min $10k virtual capital", "30-day track record", "Max 15% drawdown"],
    propFirmPartner: "Apex Capital"
  },
  {
    id: "2",
    title: "Strategy Builder Cup",
    description: "Create the most profitable automated strategy and win recognition",
    prizePool: 150000,
    participants: 1203,
    maxParticipants: 3000,
    startDate: "2024-01-20",
    endDate: "2024-02-20",
    status: "live",
    difficulty: "advanced",
    type: "strategy",
    requirements: ["Fully automated", "Min 50 trades", "Sharpe ratio > 1.5"]
  },
  {
    id: "3",
    title: "Risk Master Challenge",
    description: "Prove your risk management skills with consistent returns",
    prizePool: 75000,
    participants: 0,
    maxParticipants: 2000,
    startDate: "2024-02-01",
    endDate: "2024-03-01",
    status: "upcoming",
    difficulty: "intermediate",
    type: "risk-management",
    requirements: ["Max 5% daily drawdown", "Min 20 trades/week"],
    propFirmPartner: "Titan Trading"
  },
  {
    id: "4",
    title: "Newcomer Sprint",
    description: "Perfect for new traders to showcase their potential",
    prizePool: 25000,
    participants: 4521,
    maxParticipants: 10000,
    startDate: "2024-01-10",
    endDate: "2024-01-25",
    status: "live",
    difficulty: "beginner",
    type: "trading",
    requirements: ["No prior competition wins", "Min 10 trades"]
  }
];

const mockTopTraders: TopTrader[] = [
  { rank: 1, name: "QuantumAlpha", avatar: "QuantumAlpha", roi: 234.5, winRate: 78.2, badges: ["Elite Champion", "Risk Master", "Strategy Genius"], isPropCertified: true, fundOffers: 4 },
  { rank: 2, name: "CryptoPhoenix", avatar: "CryptoPhoenix", roi: 198.3, winRate: 72.8, badges: ["Champion", "Consistent Performer"], isPropCertified: true, fundOffers: 3 },
  { rank: 3, name: "AlgoWizard", avatar: "AlgoWizard", roi: 167.9, winRate: 69.5, badges: ["Strategy Master", "Top 10"], isPropCertified: true, fundOffers: 2 },
  { rank: 4, name: "TrendSurfer", avatar: "TrendSurfer", roi: 145.2, winRate: 65.3, badges: ["Rising Star"], isPropCertified: false, fundOffers: 1 },
  { rank: 5, name: "VoidTrader", avatar: "VoidTrader", roi: 132.8, winRate: 63.7, badges: ["Newcomer Champion"], isPropCertified: false, fundOffers: 0 },
];

const mockPropFirms: PropFirm[] = [
  { 
    name: "Apex Capital", 
    logo: "A", 
    minRoi: 50, 
    minWinRate: 60, 
    fundSize: "$50M - $500M", 
    positions: 12,
    benefits: ["Up to $2M trading capital", "80% profit split", "No personal risk", "Performance bonuses"]
  },
  { 
    name: "Titan Trading", 
    logo: "T", 
    minRoi: 35, 
    minWinRate: 55, 
    fundSize: "$10M - $100M", 
    positions: 8,
    benefits: ["Up to $500K capital", "70% profit split", "Fast payout", "Mentorship program"]
  },
  { 
    name: "Vertex Hedge", 
    logo: "V", 
    minRoi: 75, 
    minWinRate: 65, 
    fundSize: "$100M - $1B", 
    positions: 5,
    benefits: ["Up to $10M capital", "85% profit split", "Full benefits", "Equity participation"]
  },
];

const certifications = [
  { name: "Certified Trader", icon: BadgeCheck, color: "text-cyan-400", requirement: "Complete 3 contests with positive ROI" },
  { name: "Risk Expert", icon: Target, color: "text-emerald-400", requirement: "Maintain <10% drawdown for 90 days" },
  { name: "Strategy Master", icon: Zap, color: "text-amber-400", requirement: "Create 5 profitable automated strategies" },
  { name: "Elite Champion", icon: Crown, color: "text-fuchsia-400", requirement: "Win Elite Trader Championship" },
  { name: "Prop Certified", icon: Building2, color: "text-primary", requirement: "Meet prop firm requirements and get funded" },
];

export default function ContestsPage() {
  const [activeTab, setActiveTab] = useState<"contests" | "leaderboard" | "propfirms" | "certifications">("contests");

  const getDifficultyColor = (difficulty: Contest["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "intermediate": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "advanced": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "elite": return "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30";
    }
  };

  const getStatusColor = (status: Contest["status"]) => {
    switch (status) {
      case "live": return "bg-emerald-500/20 text-emerald-400 animate-pulse";
      case "upcoming": return "bg-cyan-500/20 text-cyan-400";
      case "ended": return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 ml-60">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl" />
          
          <div className="relative p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Trading Contests</h1>
                <p className="text-muted-foreground">Compete, earn certifications, and get funded by top prop firms</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {[
                { label: "Total Prize Pool", value: "$750K+", icon: DollarSign },
                { label: "Active Traders", value: "8,571", icon: Users },
                { label: "Prop Firm Partners", value: "12", icon: Building2 },
                { label: "Traders Funded", value: "342", icon: Briefcase },
              ].map((stat) => (
                <div key={stat.label} className="glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border/50 px-8">
          <div className="flex gap-1">
            {[
              { id: "contests", label: "Active Contests", icon: Trophy },
              { id: "leaderboard", label: "Top Traders", icon: Medal },
              { id: "propfirms", label: "Prop Firm Partners", icon: Building2 },
              { id: "certifications", label: "Certifications", icon: Award },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px]",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Contests Tab */}
          {activeTab === "contests" && (
            <div className="space-y-4">
              {mockContests.map((contest) => (
                <div key={contest.id} className="glass-card p-6 hover:border-primary/30 transition-all group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {contest.title}
                        </h3>
                        <Badge className={cn("text-xs", getStatusColor(contest.status))}>
                          {contest.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />}
                          {contest.status.toUpperCase()}
                        </Badge>
                        <Badge className={cn("text-xs border", getDifficultyColor(contest.difficulty))}>
                          {contest.difficulty.charAt(0).toUpperCase() + contest.difficulty.slice(1)}
                        </Badge>
                        {contest.propFirmPartner && (
                          <Badge className="text-xs bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-foreground border-0">
                            <Building2 className="h-3 w-3 mr-1" />
                            {contest.propFirmPartner}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">{contest.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {contest.requirements.map((req, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-white/5 text-muted-foreground">
                            {req}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">{contest.participants.toLocaleString()}</span>
                          <span className="text-muted-foreground">/ {contest.maxParticipants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {contest.status === "upcoming" ? `Starts ${contest.startDate}` : `Ends ${contest.endDate}`}
                          </span>
                        </div>
                      </div>

                      {contest.status === "live" && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Participation</span>
                            <span>{Math.round((contest.participants / contest.maxParticipants) * 100)}%</span>
                          </div>
                          <Progress value={(contest.participants / contest.maxParticipants) * 100} className="h-1.5" />
                        </div>
                      )}
                    </div>

                    <div className="text-right ml-8">
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground mb-1">Prize Pool</p>
                        <p className="text-2xl font-bold text-gradient">${(contest.prizePool / 1000).toFixed(0)}K</p>
                      </div>
                      <Button 
                        className={cn(
                          "group/btn",
                          contest.status === "live" 
                            ? "bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90" 
                            : contest.status === "upcoming"
                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                            : "bg-muted text-muted-foreground"
                        )}
                        disabled={contest.status === "ended"}
                      >
                        {contest.status === "live" ? "Join Now" : contest.status === "upcoming" ? "Notify Me" : "View Results"}
                        <ChevronRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="space-y-4">
              {/* Featured Top 3 */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {mockTopTraders.slice(0, 3).map((trader, index) => (
                  <div 
                    key={trader.rank}
                    className={cn(
                      "glass-card p-6 relative overflow-hidden",
                      index === 0 && "border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent",
                      index === 1 && "border-slate-400/30 bg-gradient-to-br from-slate-400/5 to-transparent",
                      index === 2 && "border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-transparent"
                    )}
                  >
                    <div className="absolute top-4 right-4">
                      {index === 0 && <Crown className="h-8 w-8 text-amber-500" />}
                      {index === 1 && <Medal className="h-8 w-8 text-slate-400" />}
                      {index === 2 && <Award className="h-8 w-8 text-orange-500" />}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trader.avatar}`}
                          alt={trader.name}
                          className="h-16 w-16 rounded-full bg-card border-2 border-white/10"
                        />
                        <span className={cn(
                          "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                          index === 0 && "bg-amber-500 text-black",
                          index === 1 && "bg-slate-400 text-black",
                          index === 2 && "bg-orange-500 text-black"
                        )}>
                          {trader.rank}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {trader.name}
                          {trader.isPropCertified && (
                            <BadgeCheck className="h-4 w-4 text-primary" />
                          )}
                        </h3>
                        {trader.fundOffers > 0 && (
                          <p className="text-xs text-primary">
                            {trader.fundOffers} fund offer{trader.fundOffers > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">ROI</p>
                        <p className="text-xl font-bold text-emerald-400">+{trader.roi}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Win Rate</p>
                        <p className="text-xl font-bold text-foreground">{trader.winRate}%</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trader.badges.map((badge, i) => (
                        <Badge key={i} variant="secondary" className="text-[10px] bg-white/5">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Leaderboard */}
              <div className="glass-card overflow-hidden">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold text-foreground">All-Time Leaderboard</h3>
                </div>
                <div className="divide-y divide-border/50">
                  {mockTopTraders.map((trader) => (
                    <div key={trader.rank} className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold",
                        trader.rank <= 3 
                          ? trader.rank === 1 ? "bg-amber-500/20 text-amber-500" 
                          : trader.rank === 2 ? "bg-slate-400/20 text-slate-400"
                          : "bg-orange-500/20 text-orange-500"
                          : "bg-white/5 text-muted-foreground"
                      )}>
                        {trader.rank}
                      </span>
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${trader.avatar}`}
                        alt={trader.name}
                        className="h-10 w-10 rounded-full bg-card"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground flex items-center gap-2">
                          {trader.name}
                          {trader.isPropCertified && <BadgeCheck className="h-4 w-4 text-primary" />}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {trader.badges.slice(0, 2).map((badge, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] bg-white/5">
                              {badge}
                            </Badge>
                          ))}
                          {trader.badges.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{trader.badges.length - 2}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-emerald-400">+{trader.roi}%</p>
                        <p className="text-xs text-muted-foreground">{trader.winRate}% win rate</p>
                      </div>
                      {trader.fundOffers > 0 && (
                        <Badge className="bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border-0">
                          <Building2 className="h-3 w-3 mr-1" />
                          {trader.fundOffers} offers
                        </Badge>
                      )}
                      <Button variant="ghost" size="sm">View Profile</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Prop Firms Tab */}
          {activeTab === "propfirms" && (
            <div className="space-y-6">
              <div className="glass-card p-6 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-500">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Get Funded by Top Prop Firms</h2>
                    <p className="text-muted-foreground">
                      Prove your trading skills in our contests and get discovered by institutional partners. 
                      Top performers receive direct offers to manage real capital with profit sharing up to 85%.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {mockPropFirms.map((firm) => (
                  <div key={firm.name} className="glass-card p-6 hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                          {firm.logo}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">{firm.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">Fund Size: {firm.fundSize}</p>
                          
                          <div className="flex gap-6 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Min ROI</p>
                              <p className="text-lg font-bold text-primary">{firm.minRoi}%+</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Min Win Rate</p>
                              <p className="text-lg font-bold text-foreground">{firm.minWinRate}%+</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Open Positions</p>
                              <p className="text-lg font-bold text-emerald-400">{firm.positions}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {firm.benefits.map((benefit, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <Button className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:opacity-90">
                          Apply Now
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">{firm.positions} positions available</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* How It Works */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">How to Get Funded</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { step: 1, title: "Compete", description: "Join trading contests and prove your skills", icon: Trophy },
                    { step: 2, title: "Perform", description: "Meet the minimum ROI and risk requirements", icon: TrendingUp },
                    { step: 3, title: "Get Certified", description: "Earn certifications and badges", icon: BadgeCheck },
                    { step: 4, title: "Get Funded", description: "Receive offers from prop firms", icon: Building2 },
                  ].map((item) => (
                    <div key={item.step} className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center mx-auto mb-3">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-xs text-primary mb-1">Step {item.step}</p>
                      <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Certifications Tab */}
          {activeTab === "certifications" && (
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-foreground mb-2">Earn Trading Certifications</h2>
                <p className="text-muted-foreground">
                  Complete challenges and meet requirements to earn industry-recognized certifications. 
                  These badges appear on your profile and are visible to prop firms and the community.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <div key={cert.name} className="glass-card p-6 hover:border-primary/30 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl bg-gradient-to-br from-white/5 to-white/10 group-hover:scale-110 transition-transform",
                        cert.color
                      )}>
                        <cert.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{cert.requirement}</p>
                        <div className="flex items-center justify-between">
                          <Progress value={Math.random() * 100} className="h-1.5 flex-1 mr-4" />
                          <Button size="sm" variant="ghost" className="text-primary hover:text-primary">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Your Certifications */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Your Certifications</h3>
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <div className="text-center">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Complete challenges to earn your first certification</p>
                    <Button className="mt-4" variant="outline">
                      Start a Challenge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
