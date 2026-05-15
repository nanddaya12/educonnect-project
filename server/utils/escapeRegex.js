/** Escape a string for safe use inside a RegExp constructor. */
export default function escapeRegex(string) {
  return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
