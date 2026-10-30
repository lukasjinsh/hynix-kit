"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { RecordForm } from "@/components/RecordForm";
import { TrendChart } from "@/components/TrendChart";
import { fmt, type TargetSummary } from "@/lib/aggregate";
import type { FieldRecord } from "@/lib/schema";

type Props = {
  kpis: { label: string; value: string }[];
  summary: TargetSummary[];
  series: { date: string; value: number }[];
  records: FieldRecord[];
};

export function Dashboard({ kpis, summary, series, records }: Props) {
  const router = useRouter();
  const [importMsg, setImportMsg] = useState<string | null>(null);

  async function onImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg("업로드 중...");
    const text = await file.text();
    const res = await fetch("/api/records/import", {
      method: "POST",
      headers: { "Content-Type": "text/csv" },
      body: text,
    });
    const json = await res.json();
    if (!res.ok) {
      setImportMsg(json.error ?? "업로드 실패");
      return;
    }
    setImportMsg(
      `${json.accepted}건 저장${json.rejected.length ? `, ${json.rejected.length}건 제외 (${json.rejected[0].row}행: ${json.rejected[0].reason})` : ""}`,
    );
    e.target.value = "";
    router.refresh();
  }

  return (
    <>
      <div className="topbar">
        <h1>현장 기록 대시보드</h1>
        <span className="muted small">스타터 · 과제에 맞게 이름과 필드를 바꾸세요</span>
      </div>

      <div className="kpis">
        {kpis.map((k) => (
          <div className="kpi" key={k.label}>
            <div className="label">{k.label}</div>
            <div className="value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>기록 추가</h2>
        <RecordForm onSaved={() => router.refresh()} />
        <div className="row">
          <label className="btn secondary" style={{ cursor: "pointer" }}>
            CSV 가져오기
            <input type="file" accept=".csv,text/csv" onChange={onImport} hidden />
          </label>
          {importMsg ? <span className="muted small">{importMsg}</span> : null}
          <a className="muted small" href="/sample_records.csv" download>
            샘플 CSV 받기
          </a>
        </div>
      </div>

      <div className="card">
        <h2>날짜별 합계 추세</h2>
        <TrendChart data={series} label="합계" />
      </div>

      <div className="card">
        <h2>대상별 요약</h2>
        <DataTable
          rows={summary}
          filterKeys={["target"]}
          columns={[
            { key: "target", header: "대상" },
            { key: "count", header: "건수", align: "right" },
            { key: "sum", header: "합계", align: "right", render: (r) => fmt(r.sum, 1) },
            { key: "mean", header: "평균", align: "right", render: (r) => fmt(r.mean, 2) },
            { key: "min", header: "최소", align: "right", render: (r) => fmt(r.min, 1) },
            { key: "max", header: "최대", align: "right", render: (r) => fmt(r.max, 1) },
            { key: "latestDate", header: "최근 날짜", render: (r) => r.latestDate ?? "-" },
          ]}
        />
      </div>

      <div className="card">
        <h2>원본 기록</h2>
        <DataTable
          rows={records}
          filterKeys={["target", "category", "author", "note"]}
          columns={[
            { key: "date", header: "날짜" },
            { key: "target", header: "대상" },
            { key: "category", header: "구분" },
            { key: "value", header: "값", align: "right" },
            { key: "author", header: "작성자" },
            { key: "note", header: "메모" },
          ]}
        />
      </div>
    </>
  );
}
