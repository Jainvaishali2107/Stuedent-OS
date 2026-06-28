import { useState } from 'react';
import { User, Bell, BellOff, Camera } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { enableNotifications } from '@/components/NotificationProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label, Select } from '@/components/ui/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

function Avatar({ user, size = 'lg' }) {
  const sizeClass = size === 'lg' ? 'h-24 w-24 text-2xl' : 'h-10 w-10 text-sm';

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-border`}
      />
    );
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-primary/20 font-bold text-primary ring-2 ring-border`}
    >
      {initials || <User className="h-6 w-6" />}
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    major: user?.major || '',
    year: user?.year || '',
    avatar: user?.avatar || '',
    notificationsEnabled: user?.notificationsEnabled ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      if (form.notificationsEnabled && 'Notification' in window) {
        const granted = await enableNotifications();
        if (!granted) {
          setError('Browser notification permission was denied.');
          setSaving(false);
          return;
        }
      }

      await updateProfile(form);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>Update your personal info and notification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar user={{ ...user, avatar: form.avatar }} />
              <div className="flex-1 space-y-2">
                <Label htmlFor="avatar" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Avatar URL
                </Label>
                <Input
                  id="avatar"
                  placeholder="https://example.com/photo.jpg"
                  value={form.avatar}
                  onChange={(e) => updateField('avatar', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Paste an image URL, or sign in with Google to auto-set your photo.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="opacity-60" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="major">Major</Label>
                <Input
                  id="major"
                  placeholder="Computer Science"
                  value={form.major}
                  onChange={(e) => updateField('major', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select id="year" value={form.year} onChange={(e) => updateField('year', e.target.value)}>
                  <option value="">Select year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </Select>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-secondary p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {form.notificationsEnabled ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Due date reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Browser notifications for todos with reminders enabled
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.notificationsEnabled}
                  onClick={() => updateField('notificationsEnabled', !form.notificationsEnabled)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    form.notificationsEnabled ? 'bg-primary' : 'bg-border'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      form.notificationsEnabled ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {message && (
              <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">{message}</div>
            )}
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-red-400">{error}</div>
            )}

            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { Avatar };
