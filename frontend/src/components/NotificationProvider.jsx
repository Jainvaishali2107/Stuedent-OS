import { useEffect, useRef } from 'react';
import { format, isToday, isTomorrow, differenceInHours, parseISO } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

const NOTIFIED_KEY = 'student-os-notified-todos';

function getNotifiedSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]'));
  } catch {
    return new Set();
  }
}

function markNotified(id) {
  const set = getNotifiedSet();
  set.add(id);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...set]));
}

async function requestPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

function showNotification(title, body) {
  if (Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/favicon.svg',
    tag: title,
  });
}

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!user?.notificationsEnabled) return;

    async function checkReminders() {
      if (!('Notification' in window)) return;

      const granted = await requestPermission();
      if (!granted) return;

      try {
        const { data: todos } = await api.get('/todos');
        const notified = getNotifiedSet();

        for (const todo of todos) {
          if (!todo.reminder || todo.completed || !todo.dueDate) continue;
          if (notified.has(todo._id)) continue;

          const due = parseISO(todo.dueDate);
          const hoursUntil = differenceInHours(due, new Date());

          let shouldNotify = false;
          let when = '';

          if (isToday(due)) {
            shouldNotify = hoursUntil <= 24;
            when = 'due today';
          } else if (isTomorrow(due)) {
            shouldNotify = true;
            when = 'due tomorrow';
          }

          if (shouldNotify) {
            showNotification(`Reminder: ${todo.title}`, `${todo.title} is ${when} (${format(due, 'MMM d')})`);
            markNotified(todo._id);
          }
        }
      } catch {
        // silently ignore polling errors
      }
    }

    checkReminders();
    intervalRef.current = setInterval(checkReminders, 60_000);

    return () => clearInterval(intervalRef.current);
  }, [user?.notificationsEnabled, user?.id]);

  return children;
}

export async function enableNotifications() {
  return requestPermission();
}
