import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  User, Settings, Shield, Bell, Wallet, 
  TrendingUp, Trophy, Target, Calendar,
  Edit3, Camera, Check, X, Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'trading', label: 'Trading Stats', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const mockStats = {
  totalTrades: 342,
  winRate: 68.4,
  totalPnL: 24580,
  avgRoi: 12.3,
  bestTrade: 3420,
  worstTrade: -890,
  tradingDays: 127,
  streakDays: 14,
};

const mockAchievements = [
  { id: 1, name: 'First Trade', icon: Target, unlocked: true, date: 'Jan 2024' },
  { id: 2, name: '10 Win Streak', icon: Trophy, unlocked: true, date: 'Feb 2024' },
  { id: 3, name: 'Pro Trader', icon: Shield, unlocked: true, date: 'Mar 2024' },
  { id: 4, name: 'Market Master', icon: TrendingUp, unlocked: false, date: null },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(
    user?.user_metadata?.display_name || 
    user?.user_metadata?.username || 
    user?.email?.split('@')[0] || 
    'Trader'
  );

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      <Sidebar />
      
      <div className="pl-60">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <h1 className="text-base font-semibold text-foreground">Profile</h1>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Profile Card */}
            <div className="glass-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-5">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="h-20 w-20 rounded-full border-gradient p-[2px]">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
                        alt="Avatar"
                        className="h-full w-full rounded-full bg-card"
                      />
                    </div>
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  {/* Info */}
                  <div>
                    <div className="flex items-center gap-3">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="glass-input px-3 py-1.5 text-lg font-semibold text-foreground"
                          />
                          <button 
                            onClick={() => setIsEditing(false)}
                            className="p-1.5 rounded hover:bg-white/10 text-primary"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setIsEditing(false)}
                            className="p-1.5 rounded hover:bg-white/10 text-muted-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h2 className="text-xl font-semibold text-foreground text-glow-sm">{displayName}</h2>
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="badge-gradient">Pro Member</span>
                      <span className="badge-cyan">Verified</span>
                    </div>
                  </div>
                </div>

                {/* User ID */}
                <div className="text-right">
                  <p className="text-xs text-muted-foreground mb-1">User ID</p>
                  <button 
                    onClick={copyUserId}
                    className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {user?.id?.slice(0, 8)}...
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50">
                {[
                  { label: 'Total P&L', value: `+$${mockStats.totalPnL.toLocaleString()}`, color: 'text-primary' },
                  { label: 'Win Rate', value: `${mockStats.winRate}%`, color: 'text-primary' },
                  { label: 'Total Trades', value: mockStats.totalTrades, color: 'text-foreground' },
                  { label: 'Trading Days', value: mockStats.tradingDays, color: 'text-foreground' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className={cn("text-xl font-semibold font-mono", stat.color)}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 glass-card w-fit">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 rounded px-4 py-2 text-sm font-medium transition-all",
                    activeTab === id
                      ? "bg-primary text-primary-foreground glow-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Achievements */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Achievements</h3>
                    <span className="badge-fuchsia">3/4 Unlocked</span>
                  </div>
                  <div className="space-y-3">
                    {mockAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg transition-colors",
                          achievement.unlocked 
                            ? "bg-white/5 border border-white/10" 
                            : "bg-white/[0.02] border border-white/5 opacity-50"
                        )}
                      >
                        <div className={cn(
                          "h-10 w-10 rounded-lg flex items-center justify-center",
                          achievement.unlocked 
                            ? "bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30"
                            : "bg-muted/50"
                        )}>
                          <achievement.icon className={cn(
                            "h-5 w-5",
                            achievement.unlocked ? "text-primary" : "text-muted-foreground"
                          )} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{achievement.name}</p>
                          {achievement.date && (
                            <p className="text-xs text-muted-foreground">{achievement.date}</p>
                          )}
                        </div>
                        {achievement.unlocked && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { action: 'Opened long position', asset: 'BTC/USDT', time: '2h ago', pnl: '+$420' },
                      { action: 'Closed short position', asset: 'ETH/USDT', time: '5h ago', pnl: '+$180' },
                      { action: 'Strategy executed', asset: 'SOL/USDT', time: '1d ago', pnl: '-$45' },
                      { action: 'Opened long position', asset: 'BTC/USDT', time: '2d ago', pnl: '+$890' },
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5">
                        <div>
                          <p className="text-sm text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.asset} · {activity.time}</p>
                        </div>
                        <span className={cn(
                          "text-sm font-mono font-medium",
                          activity.pnl.startsWith('+') ? "text-primary" : "text-destructive"
                        )}>
                          {activity.pnl}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Best Trade', value: `+$${mockStats.bestTrade.toLocaleString()}`, icon: TrendingUp, color: 'text-primary' },
                  { label: 'Worst Trade', value: `-$${Math.abs(mockStats.worstTrade).toLocaleString()}`, icon: TrendingUp, color: 'text-destructive' },
                  { label: 'Avg ROI', value: `${mockStats.avgRoi}%`, icon: Target, color: 'text-primary' },
                  { label: 'Win Streak', value: `${mockStats.streakDays} days`, icon: Trophy, color: 'text-secondary' },
                  { label: 'Total Volume', value: '$1.2M', icon: Wallet, color: 'text-foreground' },
                  { label: 'Favorite Asset', value: 'BTC/USDT', icon: Target, color: 'text-foreground' },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className={cn("text-xl font-semibold font-mono", stat.color)}>{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                {[
                  { 
                    title: 'Notifications', 
                    description: 'Manage your notification preferences',
                    icon: Bell 
                  },
                  { 
                    title: 'Security', 
                    description: 'Two-factor authentication and security settings',
                    icon: Shield 
                  },
                  { 
                    title: 'Wallet', 
                    description: 'Manage your connected wallets and payment methods',
                    icon: Wallet 
                  },
                ].map((setting) => (
                  <div key={setting.title} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <setting.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">{setting.title}</h4>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}