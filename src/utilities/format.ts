export function formatNumber(val: number, decimals = 2): string {
  if (isNaN(val)) return '0';
  if (Math.abs(val) >= 1_000_000_000) return `${(val / 1_000_000_000).toFixed(decimals)}B`;
  if (Math.abs(val) >= 1_000_000) return `${(val / 1_000_000).toFixed(decimals)}M`;
  if (Math.abs(val) >= 1_000) return `${(val / 1_000).toFixed(decimals)}k`;
  if (Number.isInteger(val)) return val.toString();
  return val.toFixed(decimals);
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
