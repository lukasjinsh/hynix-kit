import Papa from "papaparse";

export type CsvRow = { [key: string]: string };

export type ParseResult = {
  rows: CsvRow[];
  errors: string[];
  headers: string[];
};

/**
 * CSV 문자열을 헤더 기준 객체 배열로 읽는다.
 * - 빈 줄 건너뜀
 * - 값은 전부 문자열로 둔다 (숫자 변환은 호출 쪽에서 zod로)
 * - 파싱 에러는 행 번호와 함께 돌려준다. 예외를 던지지 않는다.
 */
export function parseCsv(text: string): ParseResult {
  const result = Papa.parse<CsvRow>(text.replace(/^﻿/, ""), {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
    transform: (v) => (typeof v === "string" ? v.trim() : v),
  });

  const errors = result.errors.map(
    (e) => `${e.row !== undefined ? `${e.row + 2}행` : "파일"}: ${e.message}`,
  );

  return {
    rows: result.data,
    errors,
    headers: result.meta.fields ?? [],
  };
}

/** 객체 배열을 CSV 문자열로. 엑셀에서 열리도록 BOM을 붙인다. */
export function toCsv<T extends object>(rows: T[]): string {
  return "﻿" + Papa.unparse(rows);
}
