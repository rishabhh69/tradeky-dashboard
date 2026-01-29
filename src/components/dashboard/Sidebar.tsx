import { Home, Users, LineChart, Trophy, GraduationCap, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation, Link } from "react-router-dom";

const navigationItems = [
  { name: "Dashboard", icon: Home, path: "/dashboard" },
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

  const displayName = user?.user_metadata?.display_name || 
                      user?.user_metadata?.username || 
                      user?.email?.split('@')[0] || 
                      'Trader';

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border/50 bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border/50 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
          <span className="text-sm font-bold text-white">T</span>
        </div>
        <span className="text-lg font-semibold text-gradient-logo">Tradeky</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <div className="space-y-0.5">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border/50 p-3">
        <Link
          to="/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg p-2 transition-colors",
            location.pathname === '/profile' 
              ? "bg-primary/10" 
              : "hover:bg-white/5"
          )}
        >
          <div className="relative">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
              alt="User avatar"
              className="h-8 w-8 rounded-full bg-card"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-primary">Pro Member</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleSignOut();
            }}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </Link>
      </div>
    </aside>
  );
}