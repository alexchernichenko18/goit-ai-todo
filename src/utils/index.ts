export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export const slotOf = (d: Date) => {
  const h = d.getHours();
  if (h >= 6 && h < 12) return 'morning';
  if (h >= 12 && h < 18) return 'day';
  if (h >= 18 && h < 23) return 'evening';
  return 'night';
};