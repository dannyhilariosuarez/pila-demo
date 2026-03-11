export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
