import { useEffect, useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label, Select } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const statusVariant = { interested: 'secondary', registered: 'default', completed: 'success' };

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    organizer: '',
    location: '',
    url: '',
    startDate: '',
    endDate: '',
    status: 'interested',
    notes: '',
  });

  async function load() {
    const { data } = await api.get('/hackathons');
    setHackathons(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post('/hackathons', form);
    setForm({
      name: '',
      organizer: '',
      location: '',
      url: '',
      startDate: '',
      endDate: '',
      status: 'interested',
      notes: '',
    });
    setShowForm(false);
    load();
  }

  async function updateStatus(id, status) {
    await api.put(`/hackathons/${id}`, { status });
    load();
  }

  async function deleteItem(id) {
    await api.delete(`/hackathons/${id}`);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hackathons</h1>
          <p className="text-muted-foreground">Save and track hackathon competitions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add hackathon
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    placeholder="HackMIT 2026"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Organizer</Label>
                  <Input
                    placeholder="MIT"
                    value={form.organizer}
                    onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Boston, MA / Online"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    placeholder="https://..."
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start date</Label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End date</Label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Team members, project ideas..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
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

      {hackathons.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hackathons saved yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {hackathons.map((h) => (
            <Card key={h._id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{h.name}</h3>
                    {h.organizer && <p className="text-sm text-muted-foreground">{h.organizer}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteItem(h._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant={statusVariant[h.status]}>{h.status}</Badge>
                  {h.location && <Badge variant="secondary">{h.location}</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(h.startDate), 'MMM d, yyyy')}
                  {h.endDate && ` — ${format(new Date(h.endDate), 'MMM d, yyyy')}`}
                </p>
                {h.notes && <p className="text-sm">{h.notes}</p>}
                <div className="flex gap-2 pt-1">
                  <Select
                    value={h.status}
                    onChange={(e) => updateStatus(h._id, e.target.value)}
                    className="h-8 text-xs"
                  >
                    <option value="interested">Interested</option>
                    <option value="registered">Registered</option>
                    <option value="completed">Completed</option>
                  </Select>
                  {h.url && (
                    <a href={h.url} target="_blank" rel="noreferrer">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-3 w-3" />
                        Visit
                      </Button>
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
