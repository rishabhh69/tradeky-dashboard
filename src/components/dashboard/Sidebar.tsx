import { Home, Users, LineChart, Trophy, GraduationCap, LogOut } from "lucide-react";
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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">
          T
        </div>
        <span className="text-lg font-semibold text-foreground">Tradeky</span>
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
                  "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
      <div className="border-t border-border p-3">
        <div className="flex items-center gap-3 rounded p-2 hover:bg-muted transition-colors">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}`}
            alt="User avatar"
            className="h-8 w-8 rounded-full bg-muted"
          />
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">Pro Member</p>
          </div>
          <button
            onClick={handleSignOut}
            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded hover:bg-destructive/10"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}