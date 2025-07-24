export function formatTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toLocaleString();
}
