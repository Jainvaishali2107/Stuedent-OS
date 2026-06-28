export function formatUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    major: user.major || '',
    year: user.year || '',
    avatar: user.avatar || '',
    notificationsEnabled: user.notificationsEnabled ?? true,
  };
}
