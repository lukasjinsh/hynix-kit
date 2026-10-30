"use client";

import { useState } from "react";
import { RecordInputSchema, formatZodError } from "@/lib/schema";

type Props = { onSaved?: () => void };

/**
 * 기록 1건 입력 폼. 클라이언트에서 zod로 먼저 검증하고, 서버도 같은 스키마로 다시 검증한다.
 * 필드명은 과제에 맞게 바꾼다 (schema.ts와 같이).
 */
export function RecordForm({ onSaved }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const parsed = RecordInputSchema.safeParse(data);
    if (!parsed.success) {
      setError(formatZodError(parsed.error));
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "저장에 실패했습니다");
        return;
      }
      setOk(`저장됨 (총 ${json.count}건)`);
      form.reset();
      onSaved?.();
    } catch {
      setError("서버에 연결할 수 없습니다");
    } finally {
      setBusy(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="grid-2">
        <label>
          날짜
          <input className="input" name="date" type="date" defaultValue={today} required />
        </label>
        <label>
          대상
          <input className="input" name="target" placeholder="EQ-01" required />
        </label>
        <label>
          구분
          <input className="input" name="category" placeholder="점검 / 불량 / 인수인계" required />
        </label>
        <label>
          값
          <input className="input" name="value" type="number" step="any" placeholder="0" required />
        </label>
        <label>
          작성자
          <input className="input" name="author" placeholder="이름 또는 사번" required />
        </label>
      </div>
      <label>
        메모
        <textarea className="input" name="note" rows={2} placeholder="선택" />
      </label>
      <div className="row">
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "저장 중..." : "저장"}
        </button>
        {error ? <span className="error">{error}</span> : null}
        {ok ? <span className="ok">{ok}</span> : null}
      </div>
    </form>
  );
}
