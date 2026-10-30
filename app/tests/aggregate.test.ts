import { describe, it, expect } from "vitest";
import { summarizeByTarget, rate, trend, sumByDate, fmt } from "@/lib/aggregate";

describe("rate", () => {
  it("분모 0이면 null (NaN을 내보내지 않는다)", () => {
    expect(rate(5, 0)).toBeNull();
  });
  it("정상 비율", () => {
    expect(rate(12, 200)).toBeCloseTo(0.06);
  });
  it("NaN·Infinity 입력은 null", () => {
    expect(rate(NaN, 10)).toBeNull();
    expect(rate(1, Infinity)).toBeNull();
  });
});

describe("summarizeByTarget", () => {
  const rows = [
    { target: "EQ-B", date: "2026-10-02", value: 4 },
    { target: "EQ-A", date: "2026-10-01", value: 2 },
    { target: "EQ-B", date: "2026-10-01", value: 3 },
    { target: "EQ-A", date: "2026-10-02", value: 3 },
  ];

  it("대상별로 묶고 이름순 정렬", () => {
    const s = summarizeByTarget(rows);
    expect(s.map((x) => x.target)).toEqual(["EQ-A", "EQ-B"]);
  });

  it("건수·합계·평균·최신값", () => {
    const b = summarizeByTarget(rows).find((x) => x.target === "EQ-B")!;
    expect(b.count).toBe(2);
    expect(b.sum).toBe(7);
    expect(b.mean).toBe(3.5);
    expect(b.latest).toBe(4);
    expect(b.latestDate).toBe("2026-10-02");
  });

  it("빈 입력은 빈 배열", () => {
    expect(summarizeByTarget([])).toEqual([]);
  });
});

describe("trend", () => {
  it("2개 미만이면 insufficient", () => {
    expect(trend([5])).toBe("insufficient");
    expect(trend([])).toBe("insufficient");
  });
  it("10% 이상 오르면 up", () => {
    expect(trend([3, 4, 7, 9, 12])).toBe("up");
  });
  it("변화 작으면 flat", () => {
    expect(trend([10, 10.5])).toBe("flat");
  });
  it("첫 값 0이면 0으로 나누지 않는다", () => {
    expect(trend([0, 3])).toBe("up");
    expect(trend([0, 0])).toBe("flat");
  });
});

describe("sumByDate", () => {
  it("날짜별 합계를 오름차순으로", () => {
    const s = sumByDate([
      { target: "A", date: "2026-10-02", value: 1 },
      { target: "B", date: "2026-10-01", value: 2 },
      { target: "C", date: "2026-10-02", value: 3 },
    ]);
    expect(s).toEqual([
      { date: "2026-10-01", value: 2 },
      { date: "2026-10-02", value: 4 },
    ]);
  });
});

describe("fmt", () => {
  it("null은 대시", () => {
    expect(fmt(null)).toBe("-");
  });
});
