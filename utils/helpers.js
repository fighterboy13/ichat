export function safeString(v) {
  if (!v && v !== 0) return '';
  return String(v);
}
