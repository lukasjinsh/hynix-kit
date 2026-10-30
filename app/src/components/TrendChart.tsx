"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

type Point = { date: string; value: number };

/** 날짜별 값 선 차트. 데이터가 2개 미만이면 차트 대신 안내 문구. */
export function TrendChart({ data, label = "값" }: { data: Point[]; label?: string }) {
  if (data.length < 2) {
    return <div className="muted">추세를 그리려면 2개 이상의 날짜 데이터가 필요합니다.</div>;
  }
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} width={48} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            name={label}
            stroke="var(--accent)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
