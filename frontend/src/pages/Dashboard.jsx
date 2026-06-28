import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import {
  CheckSquare,
  GraduationCap,
  CalendarDays,
  Trophy,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

function formatRelativeDate(date) {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d, yyyy');
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ todos: 0, pendingTodos: 0, classes: 0, events: 0, hackathons: 0 });
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    async function load() {
      const [todos, classes, events, hackathons] = await Promise.all([
        api.get('/todos'),
        api.get('/classes'),
        api.get('/events'),
        api.get('/hackathons'),
      ]);

      const pendingTodos = todos.data.filter((t) => !t.completed).length;

      const combined = [
        ...events.data.map((e) => ({ ...e, type: 'event', date: e.startDate })),
        ...hackathons.data.map((h) => ({ ...h, type: 'hackathon', date: h.startDate, title: h.name })),
      ]
        .filter((item) => !isPast(new Date(item.date)) || isToday(new Date(item.date)))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setStats({
        todos: todos.data.length,
        pendingTodos,
        classes: classes.data.length,
        events: events.data.length,
        hackathons: hackathons.data.length,
      });
      setUpcoming(combined);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Pending todos', value: stats.pendingTodos, total: stats.todos, icon: CheckSquare, to: '/todos', color: 'text-blue-400' },
    { label: 'Classes', value: stats.classes, icon: GraduationCap, to: '/classes', color: 'text-violet-400' },
    { label: 'Upcoming events', value: stats.events, icon: CalendarDays, to: '/events', color: 'text-emerald-400' },
    { label: 'Hackathons', value: stats.hackathons, icon: Trophy, to: '/hackathons', color: 'text-amber-400' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Hey, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Your personal command center — todos, classes, events, and hackathons in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, total, icon: Icon, to, color }) => (
          <Link key={to} to={to}>
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl bg-secondary p-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">
                    {total !== undefined ? `${label} / ${total} total` : label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Coming up
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming events or hackathons yet.</p>
            ) : (
              <ul className="space-y-3">
                {upcoming.map((item) => (
                  <li
                    key={`${item.type}-${item._id}`}
                    className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{item.title || item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatRelativeDate(item.date)}</p>
                    </div>
                    <Badge variant={item.type === 'hackathon' ? 'warning' : 'default'}>
                      {item.type}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick links</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {[
              { to: '/calendar', label: 'Open calendar', desc: 'Classes and events month view' },
              { to: '/todos', label: 'Manage todos', desc: 'Track assignments and tasks' },
              { to: '/classes', label: 'View schedule', desc: 'Your weekly class timetable' },
              { to: '/events', label: 'Browse events', desc: 'Workshops, meetups, and more' },
              { to: '/hackathons', label: 'Hackathon tracker', desc: 'Save and track competitions' },
            ].map(({ to, label, desc }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 transition-colors hover:bg-secondary/80"
              >
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
