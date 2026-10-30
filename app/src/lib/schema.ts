import { z } from "zod";

/**
 * 범용 "현장 기록" 스키마.
 * 과제에 맞게 필드명을 바꿔 쓴다. 설비 점검, 교대 인수인계, 불량 리포트 등
 * 대부분의 현장 운영 도구는 "누가 / 언제 / 어느 대상에 / 무엇을 / 어떤 값으로" 구조다.
 */
export const RecordSchema = z.object({
  id: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "날짜는 YYYY-MM-DD 형식이어야 합니다"),
  target: z.string().min(1, "대상(설비·라인·구역)은 필수입니다"),
  category: z.string().min(1, "구분은 필수입니다"),
  value: z.number().finite("값은 숫자여야 합니다"),
  note: z.string().max(500, "메모는 500자 이내").default(""),
  author: z.string().min(1, "작성자는 필수입니다"),
});

export type FieldRecord = z.infer<typeof RecordSchema>;

/** 폼 입력용: id 없이 들어오고 value는 문자열일 수 있다. */
export const RecordInputSchema = RecordSchema.omit({ id: true }).extend({
  value: z.coerce.number().finite("값은 숫자여야 합니다"),
});

export type RecordInput = z.infer<typeof RecordInputSchema>;

/** zod 에러를 사용자에게 보여 줄 한 줄 메시지로 */
export function formatZodError(error: z.ZodError): string {
  return error.issues
    .map((i) => `${i.path.join(".") || "입력"}: ${i.message}`)
    .join(" / ");
}
