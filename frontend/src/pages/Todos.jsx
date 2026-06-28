import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Check, Circle } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label, Select } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

const priorityVariant = { low: 'secondary', medium: 'default', high: 'destructive' };

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', reminder: false });

  async function loadTodos() {
    const { data } = await api.get('/todos');
    setTodos(data);
  }

  useEffect(() => {
    loadTodos();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post('/todos', {
      ...form,
      dueDate: form.dueDate || undefined,
    });
    setForm({ title: '', description: '', priority: 'medium', dueDate: '', reminder: false });
    setShowForm(false);
    loadTodos();
  }

  async function toggleComplete(todo) {
    await api.put(`/todos/${todo._id}`, { completed: !todo.completed });
    loadTodos();
  }

  async function deleteTodo(id) {
    await api.delete(`/todos/${id}`);
    loadTodos();
  }

  const pending = todos.filter((t) => !t.completed);
  const completed = todos.filter((t) => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Todos</h1>
          <p className="text-muted-foreground">Track assignments, tasks, and deadlines</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add todo
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Finish lab report"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Optional details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Due date</Label>
                  <Input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.reminder}
                  onChange={(e) => setForm({ ...form, reminder: e.target.checked })}
                  className="rounded border-border"
                />
                Remind me before this due date
              </label>
              <div className="flex gap-2">
                <Button type="submit">Save todo</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pending todos. You&apos;re all caught up!</p>
        ) : (
          <div className="space-y-2">
            {pending.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleComplete}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        )}
      </div>

      {completed.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-muted-foreground">Completed ({completed.length})</h2>
          <div className="space-y-2 opacity-60">
            {completed.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={toggleComplete}
                onDelete={deleteTodo}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-4">
        <button
          onClick={() => onToggle(todo)}
          className="mt-0.5 text-muted-foreground hover:text-primary"
        >
          {todo.completed ? <Check className="h-5 w-5 text-emerald-400" /> : <Circle className="h-5 w-5" />}
        </button>
        <div className="flex-1">
          <p className={cn('font-medium', todo.completed && 'line-through')}>{todo.title}</p>
          {todo.description && (
            <p className="mt-1 text-sm text-muted-foreground">{todo.description}</p>
          )}
          <div className="mt-2 flex gap-2">
            <Badge variant={priorityVariant[todo.priority]}>{todo.priority}</Badge>
            {todo.dueDate && (
              <Badge variant="secondary">Due {format(new Date(todo.dueDate), 'MMM d')}</Badge>
            )}
            {todo.reminder && <Badge variant="warning">Reminder on</Badge>}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => onDelete(todo._id)}>
          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
}
