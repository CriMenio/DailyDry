/** Display order placed timestamp from sheet (yyyy-MM-dd HH:mm:ss). */
export function formatOrderPlacedAt(value?: string): string | null {
  const raw = value?.trim();
  if (!raw) return null;
  const isoLike = raw.replace(' ', 'T');
  const d = new Date(isoLike);
  if (!Number.isNaN(d.getTime())) {
    return d.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return raw;
}
