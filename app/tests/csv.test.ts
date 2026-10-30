import { describe, it, expect } from "vitest";
import { parseCsv, toCsv } from "@/lib/csv";
import { RecordInputSchema } from "@/lib/schema";

describe("parseCsv", () => {
  it("헤더 기준으로 객체 배열을 만들고 공백을 다듬는다", () => {
    const { rows, headers, errors } = parseCsv("date, target ,value\n2026-10-01, EQ-A ,2\n");
    expect(headers).toEqual(["date", "target", "value"]);
    expect(rows).toEqual([{ date: "2026-10-01", target: "EQ-A", value: "2" }]);
    expect(errors).toEqual([]);
  });

  it("BOM과 빈 줄을 무시한다", () => {
    const { rows } = parseCsv("﻿a,b\n\n1,2\n\n");
    expect(rows).toEqual([{ a: "1", b: "2" }]);
  });

  it("값은 문자열로 둔다 (숫자 변환은 스키마에서)", () => {
    const { rows } = parseCsv("value\n3.5");
    expect(rows[0].value).toBe("3.5");
    const parsed = RecordInputSchema.safeParse({
      date: "2026-10-01",
      target: "X",
      category: "c",
      author: "a",
      ...rows[0],
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.value).toBe(3.5);
  });
});

describe("toCsv", () => {
  it("BOM을 붙이고 헤더를 쓴다", () => {
    const out = toCsv([{ a: 1, b: "x" }]);
    expect(out.startsWith("﻿")).toBe(true);
    expect(out).toContain("a,b");
    expect(out).toContain("1,x");
  });
});
