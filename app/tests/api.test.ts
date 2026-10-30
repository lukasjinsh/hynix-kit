import { describe, it, expect, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

// 테스트는 임시 폴더에 저장하도록 DATA_DIR을 먼저 고정한다
const dir = mkdtempSync(path.join(tmpdir(), "records-"));
process.env.DATA_DIR = dir;

let GET: typeof import("@/app/api/records/route").GET;
let POST: typeof import("@/app/api/records/route").POST;
let IMPORT: typeof import("@/app/api/records/import/route").POST;

beforeAll(async () => {
  ({ GET, POST } = await import("@/app/api/records/route"));
  ({ POST: IMPORT } = await import("@/app/api/records/import/route"));
});

function json(body: unknown) {
  return new Request("http://test/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/records", () => {
  it("잘못된 입력은 400과 읽을 수 있는 메시지", async () => {
    const res = await POST(json({ date: "20261001", target: "", value: "abc" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("date");
  });

  it("정상 입력은 201, id가 생성된다", async () => {
    const res = await POST(
      json({ date: "2026-10-01", target: "EQ-A", category: "불량", value: "2", author: "kim" }),
    );
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.record.id).toBeTruthy();
    expect(body.record.value).toBe(2);
  });

  it("GET으로 저장된 것이 읽힌다", async () => {
    const res = await GET();
    const body = await res.json();
    expect(body.records.length).toBe(1);
    expect(body.records[0].target).toBe("EQ-A");
  });
});

describe("POST /api/records/import", () => {
  it("CSV 부분 성공: 통과 행은 저장, 실패 행은 번호와 이유", async () => {
    const csv = [
      "date,target,category,value,author",
      "2026-10-02,EQ-B,불량,4,kim",
      "bad-date,EQ-B,불량,4,kim",
      "2026-10-03,EQ-B,불량,x,kim",
    ].join("\n");
    const res = await IMPORT(
      new Request("http://test/api/records/import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: csv,
      }),
    );
    const body = await res.json();
    expect(body.accepted).toBe(1);
    expect(body.rejected.length).toBe(2);
    expect(body.rejected[0].row).toBe(3);
  });

  it("빈 본문은 400", async () => {
    const res = await IMPORT(
      new Request("http://test/api/records/import", { method: "POST", body: "  " }),
    );
    expect(res.status).toBe(400);
  });
});
