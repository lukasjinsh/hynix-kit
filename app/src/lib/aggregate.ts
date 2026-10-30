/**
 * 집계는 전부 여기, 고정 코드로 한다 (결정론 코어).
 * LLM은 이 결과를 설명·요약하는 데만 쓴다.
 */

export type Row = { target: string; date: string; value: number; category?: string };

export type TargetSummary = {
  target: string;
  count: number;
  sum: number;
  mean: number | null;
  min: number | null;
  max: number | null;
  latest: number | null;
  latestDate: string | null;
};

/** 대상별 건수·합계·평균·최소·최대·최신값. 빈 그룹은 null. */
export function summarizeByTarget(rows: Row[]): TargetSummary[] {
  const groups = new Map<string, Row[]>();
  for (const r of rows) {
    if (!groups.has(r.target)) groups.set(r.target, []);
    groups.get(r.target)!.push(r);
  }

  const out: TargetSummary[] = [];
  for (const [target, items] of groups) {
    const values = items.map((i) => i.value).filter((v) => Number.isFinite(v));
    const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
    const last = sorted.at(-1) ?? null;
    out.push({
      target,
      count: items.length,
      sum: values.reduce((a, b) => a + b, 0),
      mean: values.length ? values.reduce((a, b) => a + b, 0) / values.length : null,
      min: values.length ? Math.min(...values) : null,
      max: values.length ? Math.max(...values) : null,
      latest: last ? last.value : null,
      latestDate: last ? last.date : null,
    });
  }
  return out.sort((a, b) => a.target.localeCompare(b.target));
}

/** 비율 계산. 분모 0이면 null (NaN·Infinity를 표에 내보내지 않는다). */
export function rate(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator)) return null;
  if (denominator === 0) return null;
  return numerator / denominator;
}

export type Trend = "up" | "down" | "flat" | "insufficient";

/**
 * 최근 n개의 단순 추세. 첫 값 대비 마지막 값이 threshold(비율) 이상 움직이면 up/down.
 * 데이터가 2개 미만이면 insufficient.
 */
export function trend(values: number[], threshold = 0.1): Trend {
  const v = values.filter((x) => Number.isFinite(x));
  if (v.length < 2) return "insufficient";
  const first = v[0];
  const last = v[v.length - 1];
  if (first === 0) return last > 0 ? "up" : last < 0 ? "down" : "flat";
  const change = (last - first) / Math.abs(first);
  if (change >= threshold) return "up";
  if (change <= -threshold) return "down";
  return "flat";
}

/** 날짜별 합계 (차트용). 날짜 오름차순. */
export function sumByDate(rows: Row[]): { date: string; value: number }[] {
  const m = new Map<string, number>();
  for (const r of rows) {
    if (!Number.isFinite(r.value)) continue;
    m.set(r.date, (m.get(r.date) ?? 0) + r.value);
  }
  return [...m.entries()]
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** 숫자 표시용. null은 "-" */
export function fmt(n: number | null, digits = 2): string {
  if (n === null || !Number.isFinite(n)) return "-";
  return n.toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

export function fmtPercent(r: number | null, digits = 1): string {
  if (r === null || !Number.isFinite(r)) return "-";
  return `${(r * 100).toFixed(digits)}%`;
}
