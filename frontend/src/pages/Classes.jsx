import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label, Select } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444'];

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    courseName: '',
    courseCode: '',
    instructor: '',
    location: '',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:00',
    color: '#6366f1',
    notes: '',
  });

  async function load() {
    const { data } = await api.get('/classes');
    setClasses(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    await api.post('/classes', form);
    setForm({
      courseName: '',
      courseCode: '',
      instructor: '',
      location: '',
      dayOfWeek: 'Monday',
      startTime: '09:00',
      endTime: '10:00',
      color: '#6366f1',
      notes: '',
    });
    setShowForm(false);
    load();
  }

  async function deleteItem(id) {
    await api.delete(`/classes/${id}`);
    load();
  }

  const schedule = DAYS.map((day) => ({
    day,
    classes: classes.filter((c) => c.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Classes</h1>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add class
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Course name</Label>
                  <Input
                    placeholder="Data Structures"
                    value={form.courseName}
                    onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Course code</Label>
                  <Input
                    placeholder="CS 201"
                    value={form.courseCode}
                    onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instructor</Label>
                  <Input
                    placeholder="Dr. Smith"
                    value={form.instructor}
                    onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Room 204"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Day</Label>
                  <Select
                    value={form.dayOfWeek}
                    onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <div className="flex gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110"
                        style={{
                          backgroundColor: color,
                          borderColor: form.color === color ? '#fff' : 'transparent',
                        }}
                        onClick={() => setForm({ ...form, color })}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Start time</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>End time</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Office hours, syllabus link..."
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

      {classes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No classes added yet.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {schedule
            .filter(({ classes: dayClasses }) => dayClasses.length > 0)
            .map(({ day, classes: dayClasses }) => (
              <Card key={day}>
                <CardContent className="p-5">
                  <h3 className="mb-3 font-semibold">{day}</h3>
                  <div className="space-y-2">
                    {dayClasses.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-start justify-between rounded-lg bg-secondary p-3"
                        style={{ borderLeft: `3px solid ${c.color}` }}
                      >
                        <div>
                          <p className="font-medium">
                            {c.courseName}
                            {c.courseCode && (
                              <span className="ml-2 text-sm text-muted-foreground">({c.courseCode})</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {c.startTime} – {c.endTime}
                            {c.location && ` · ${c.location}`}
                          </p>
                          {c.instructor && (
                            <p className="text-xs text-muted-foreground">{c.instructor}</p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem(c._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
