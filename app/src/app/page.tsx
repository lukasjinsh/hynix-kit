import { readAll } from "@/lib/store";
import { summarizeByTarget, sumByDate, trend, fmt } from "@/lib/aggregate";
import { Dashboard } from "./dashboard";

export const dynamic = "force-dynamic";

/**
 * 서버 컴포넌트: 데이터를 읽고 집계한 뒤 클라이언트 컴포넌트에 넘긴다.
 * 집계는 서버(고정 코드)에서, 상호작용은 클라이언트에서.
 */
export default async function Page() {
  const records = await readAll();
  const summary = summarizeByTarget(records);
  const series = sumByDate(records);
  const t = trend(series.map((p) => p.value));

  const kpis = [
    { label: "총 기록", value: String(records.length) },
    { label: "대상 수", value: String(summary.length) },
    {
      label: "전체 합계",
      value: fmt(records.reduce((a, r) => a + r.value, 0), 1),
    },
    {
      label: "최근 추세",
      value: t === "up" ? "상승" : t === "down" ? "하락" : t === "flat" ? "보합" : "데이터 부족",
    },
  ];

  return <Dashboard kpis={kpis} summary={summary} series={series} records={records} />;
}
