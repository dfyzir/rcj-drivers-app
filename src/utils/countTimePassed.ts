import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export const DATE_FMT = "MM/DD/YYYY";

export function monthsCoveredLast3Years(
  arr: Array<{ from: string; to: string }>
): number {
  const now = dayjs().endOf("day");
  const cutoff = now.subtract(3, "year").startOf("day");

  // 1) normalize + clamp, skip invalid
  const clamped: [Dayjs, Dayjs][] = arr
    .map(({ from, to }) => {
      const f = dayjs(from, DATE_FMT, true).startOf("day");
      const t = dayjs(to, DATE_FMT, true).endOf("day");
      if (!f.isValid() || !t.isValid() || t.isBefore(cutoff)) return null;

      const start = f.isBefore(cutoff) ? cutoff : f;
      const end = t.isAfter(now) ? now : t;
      return end.isAfter(start) ? ([start, end] as [Dayjs, Dayjs]) : null;
    })
    .filter(Boolean) as [Dayjs, Dayjs][];

  if (!clamped.length) return 0;

  // 2) sort + merge overlaps
  clamped.sort((a, b) => a[0].valueOf() - b[0].valueOf());
  const merged: [Dayjs, Dayjs][] = [clamped[0]];
  for (let i = 1; i < clamped.length; i++) {
    const [s, e] = clamped[i];
    const last = merged[merged.length - 1];
    if (s.isAfter(last[1])) {
      merged.push([s, e]);
    } else if (e.isAfter(last[1])) {
      last[1] = e;
    }
  }

  // 3) exact months (fractional OK)
  return merged.reduce((sum, [s, e]) => sum + e.diff(s, "month", true), 0);
}
