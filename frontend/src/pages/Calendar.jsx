import { useEffect, useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_MAP = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      const [classRes, eventRes] = await Promise.all([api.get('/classes'), api.get('/events')]);
      setClasses(classRes.data);
      setEvents(eventRes.data);
    }
    load();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPadding = getDay(monthStart);

  function getItemsForDay(day) {
    const dayEvents = events.filter((e) => isSameDay(new Date(e.startDate), day));
    const dayClasses = classes.filter((c) => getDay(day) === WEEKDAY_MAP[c.dayOfWeek]);
    return { dayEvents, dayClasses };
  }

  const selectedItems = getItemsForDay(selectedDay);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">Your classes and events at a glance</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setCurrentMonth(new Date()); setSelectedDay(new Date()); }}>
                Today
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1">
              {DAY_NAMES.map((d) => (
                <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startPadding }).map((_, i) => (
                <div key={`pad-${i}`} className="aspect-square" />
              ))}
              {days.map((day) => {
                const { dayEvents, dayClasses } = getItemsForDay(day);
                const count = dayEvents.length + dayClasses.length;
                const isSelected = isSameDay(day, selectedDay);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDay(day)}
                    className={cn(
                      'aspect-square rounded-lg border p-1 text-left transition-colors',
                      !isSameMonth(day, currentMonth) && 'opacity-40',
                      isSelected ? 'border-primary bg-primary/10' : 'border-transparent hover:bg-secondary',
                      isToday && !isSelected && 'ring-1 ring-primary/50'
                    )}
                  >
                    <span className={cn('text-sm font-medium', isToday && 'text-primary')}>
                      {format(day, 'd')}
                    </span>
                    {count > 0 && (
                      <div className="mt-1 flex flex-wrap gap-0.5">
                        {dayClasses.slice(0, 2).map((c) => (
                          <span
                            key={c._id}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                        ))}
                        {dayEvents.slice(0, 2).map((e) => (
                          <span key={e._id} className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400" /> Classes
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Events
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{format(selectedDay, 'EEEE, MMM d')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedItems.dayClasses.length === 0 && selectedItems.dayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled this day.</p>
            ) : (
              <>
                {selectedItems.dayClasses.map((c) => (
                  <div
                    key={c._id}
                    className="rounded-lg bg-secondary p-3"
                    style={{ borderLeft: `3px solid ${c.color}` }}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Class</Badge>
                      <p className="font-medium">{c.courseName}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.startTime} – {c.endTime}
                      {c.location && ` · ${c.location}`}
                    </p>
                  </div>
                ))}
                {selectedItems.dayEvents.map((e) => (
                  <div key={e._id} className="rounded-lg bg-secondary p-3" style={{ borderLeft: '3px solid #10b981' }}>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">Event</Badge>
                      <p className="font-medium">{e.title}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {format(new Date(e.startDate), 'h:mm a')}
                      {e.location && ` · ${e.location}`}
                    </p>
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
