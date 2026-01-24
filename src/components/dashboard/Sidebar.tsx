import { Home, Users, LineChart, Trophy, GraduationCap, Zap, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navigationItems = [
  { name: "Home", icon: Home, path: "/dashboard" },
  { name: "Community", icon: Users, path: "/community" },
  { name: "Charts", icon: LineChart, path: "/charts" },
  { name: "Contests", icon: Trophy, path: "/contests" },
  { name: "Learn", icon: GraduationCap, path: "/learn" },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.display_name || 
                      user?.user_metadata?.username || 
                      user?.email?.split('@')[0] || 
                      'Trader';

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-emerald-400 glow-primary">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-gradient-primary">Trade</span>
          <span className="text-foreground">ky</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary neon-border-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        <div className="glass-card-hover flex items-center gap-3 p-3">
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
              alt="User avatar"
              className="h-10 w-10 rounded-full ring-2 ring-primary/50"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-sidebar bg-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <div className="flex items-center gap-1">
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-secondary/20 to-pink-500/20 px-2 py-0.5 text-xs font-medium text-secondary">
                Pro Member
              </span>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
