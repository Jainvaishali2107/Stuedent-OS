import { useEffect, useState } from 'react';
import { Plus, Trash2, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label, Select } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const categoryVariant = {
  workshop: 'default',
  meetup: 'success',
  career: 'warning',
  social: 'secondary',
  other: 'secondary',
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: 'other',
    startDate: '',
    endDate: '',
    reminder: false,
  });

  async function load() {
    const { data } = await api.get('/events');
    setEvents(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post('/events', form);
    setForm({
      title: '',
      description: '',
      location: '',
      category: 'other',
      startDate: '',
      endDate: '',
      reminder: false,
    });
    setShowForm(false);
    load();
  }

  async function deleteItem(id) {
    await api.delete(`/events/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Workshops, meetups, career fairs, and more</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add event
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Career fair"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="meetup">Meetup</option>
                    <option value="career">Career</option>
                    <option value="social">Social</option>
                    <option value="other">Other</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Student center"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Event details..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {events.length === 0 ? (
        <p className="text-sm text-muted-foreground">No events yet. Add your first one!</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <Card key={event._id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant={categoryVariant[event.category]}>{event.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(event.startDate), 'EEE, MMM d · h:mm a')}
                    {event.endDate && ` — ${format(new Date(event.endDate), 'h:mm a')}`}
                  </p>
                  {event.location && (
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </p>
                  )}
                  {event.description && <p className="text-sm">{event.description}</p>}
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(event._id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
