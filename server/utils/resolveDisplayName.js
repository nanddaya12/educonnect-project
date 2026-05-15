/** Display name for header / UI from user + optional profile doc. */
export default function resolveDisplayName(user, profile) {
  if (profile?.name) return profile.name;
  if (user?.role === 'admin') return 'Administrator';
  if (user?.email) return user.email.split('@')[0];
  return user?.uniqueId || 'User';
}
