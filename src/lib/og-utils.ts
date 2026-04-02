/**
 * Shared OG image utilities — ball color palette and common layout helpers.
 * Used by all opengraph-image.tsx files.
 */

export const OG_SIZE = { width: 1200, height: 630 };

export function getBallFill(value: number): string {
  if (value <= 10) return "#d97706"; // amber
  if (value <= 20) return "#0369a1"; // blue
  if (value <= 30) return "#be123c"; // rose
  if (value <= 40) return "#047857"; // emerald
  return "#5b21b6"; // violet
}

export function getBallTextColor(value: number): string {
  return value <= 10 ? "#1c1917" : "#ffffff";
}
