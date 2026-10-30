import { promises as fs } from "node:fs";
import path from "node:path";
import { RecordSchema, type FieldRecord } from "./schema";

/**
 * 가장 단순한 저장소: JSON 파일 하나.
 * - DB 설치 없이 샌드박스에서 바로 동작
 * - 서버 재시작해도 유지
 * - 동시 쓰기 보호는 없다 (1인 사용 전제). README 한계에 적을 것.
 *
 * 과제가 DB를 요구하면 이 파일만 바꾼다. 인터페이스는 유지.
 */

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "records.json");

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readAll(): Promise<FieldRecord[]> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // 손상된 행은 버리고 로그만 남긴다
    const valid: FieldRecord[] = [];
    for (const item of parsed) {
      const r = RecordSchema.safeParse(item);
      if (r.success) valid.push(r.data);
      else console.warn("[store] invalid record skipped:", r.error.issues[0]?.message);
    }
    return valid;
  } catch (e: unknown) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw e;
  }
}

export async function writeAll(records: FieldRecord[]): Promise<void> {
  await ensureDir();
  const tmp = FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(records, null, 2), "utf8");
  await fs.rename(tmp, FILE); // 쓰다 죽어도 원본은 남는다
}

export async function append(record: FieldRecord): Promise<FieldRecord[]> {
  const all = await readAll();
  all.push(record);
  await writeAll(all);
  return all;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
