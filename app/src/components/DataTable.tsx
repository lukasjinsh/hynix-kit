"use client";

import { useMemo, useState } from "react";

export type Column<T> = {
  key: keyof T & string;
  header: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "right";
};

type Props<T extends object> = {
  rows: T[];
  columns: Column<T>[];
  filterKeys?: (keyof T & string)[];
  emptyText?: string;
};

/**
 * 정렬·텍스트 필터가 되는 단순 표. 외부 의존성 없음.
 * 행 수천 개 이상이면 REFERENCES.md의 TanStack/table 또는 react-window로 교체.
 */
export function DataTable<T extends object>({
  rows,
  columns,
  filterKeys,
  emptyText = "데이터가 없습니다",
}: Props<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [asc, setAsc] = useState(true);
  const [q, setQ] = useState("");

  const view = useMemo(() => {
    let out = rows;
    if (q && filterKeys?.length) {
      const needle = q.toLowerCase();
      out = out.filter((r) =>
        filterKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)),
      );
    }
    if (sortKey) {
      out = [...out].sort((a, b) => {
        const av = (a as Record<string, unknown>)[sortKey];
        const bv = (b as Record<string, unknown>)[sortKey];
        if (typeof av === "number" && typeof bv === "number") return asc ? av - bv : bv - av;
        return asc
          ? String(av ?? "").localeCompare(String(bv ?? ""))
          : String(bv ?? "").localeCompare(String(av ?? ""));
      });
    }
    return out;
  }, [rows, q, sortKey, asc, filterKeys]);

  function toggleSort(k: string) {
    if (sortKey === k) setAsc(!asc);
    else {
      setSortKey(k);
      setAsc(true);
    }
  }

  return (
    <div className="table-wrap">
      {filterKeys?.length ? (
        <input
          className="input"
          placeholder="검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="표 검색"
        />
      ) : null}
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                onClick={() => toggleSort(c.key)}
                style={{ textAlign: c.align ?? "left", cursor: "pointer" }}
                aria-sort={sortKey === c.key ? (asc ? "ascending" : "descending") : "none"}
              >
                {c.header}
                {sortKey === c.key ? (asc ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {view.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="muted">
                {emptyText}
              </td>
            </tr>
          ) : (
            view.map((row, i) => (
              <tr key={i}>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? "left" }}>
                    {c.render ? c.render(row) : String(row[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="muted small">
        {view.length}건{q ? ` (전체 ${rows.length}건 중)` : ""}
      </div>
    </div>
  );
}
