import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Trophy,
  CalendarDays,
  GraduationCap,
  LogOut,
  Sparkles,
  Calendar,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/pages/Profile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/todos', label: 'Todos', icon: CheckSquare },
  { to: '/classes', label: 'Classes', icon: GraduationCap },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/hackathons', label: 'Hackathons', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: User },
];

export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-border bg-card">
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Student OS</h1>
            <p className="text-xs text-muted-foreground">Your personal hub</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <NavLink
            to="/profile"
            className="mb-3 flex items-center gap-3 rounded-lg bg-secondary px-3 py-2 transition-colors hover:bg-secondary/80"
          >
            <Avatar user={user} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </NavLink>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </aside>

      <main className="ml-64 flex-1">
        <div className="mx-auto max-w-6xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
