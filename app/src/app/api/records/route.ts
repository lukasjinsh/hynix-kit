import { NextResponse } from "next/server";
import { RecordInputSchema, formatZodError } from "@/lib/schema";
import { readAll, append, newId } from "@/lib/store";

export const runtime = "nodejs";

/** GET /api/records → 전체 기록 */
export async function GET() {
  const records = await readAll();
  return NextResponse.json({ records });
}

/** POST /api/records → 기록 1건 추가. 검증 실패는 400 + 읽을 수 있는 메시지 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON 본문이 필요합니다" }, { status: 400 });
  }

  const parsed = RecordInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: formatZodError(parsed.error) }, { status: 400 });
  }

  const record = { id: newId(), ...parsed.data };
  const records = await append(record);
  return NextResponse.json({ record, count: records.length }, { status: 201 });
}
