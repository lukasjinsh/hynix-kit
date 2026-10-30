import { NextResponse } from "next/server";
import { parseCsv } from "@/lib/csv";
import { RecordInputSchema, formatZodError, type FieldRecord } from "@/lib/schema";
import { readAll, writeAll, newId } from "@/lib/store";

export const runtime = "nodejs";

/**
 * POST /api/records/import (text/csv 본문)
 * CSV를 받아 검증 통과한 행만 저장한다. 실패한 행은 번호와 이유를 돌려준다.
 * 부분 성공을 허용하는 이유: 현장 데이터는 한두 행 깨진 경우가 흔하고,
 * 전체 거부보다 "무엇이 왜 빠졌는지"를 보여 주는 쪽이 실무에 맞다.
 */
export async function POST(req: Request) {
  const text = await req.text();
  if (!text.trim()) {
    return NextResponse.json({ error: "빈 파일입니다" }, { status: 400 });
  }

  const { rows, errors } = parseCsv(text);
  const accepted: FieldRecord[] = [];
  const rejected: { row: number; reason: string }[] = errors.map((e, i) => ({
    row: i,
    reason: e,
  }));

  rows.forEach((row, i) => {
    const parsed = RecordInputSchema.safeParse(row);
    if (parsed.success) accepted.push({ id: newId(), ...parsed.data });
    else rejected.push({ row: i + 2, reason: formatZodError(parsed.error) });
  });

  if (accepted.length) {
    const all = await readAll();
    await writeAll([...all, ...accepted]);
  }

  return NextResponse.json({ accepted: accepted.length, rejected });
}
