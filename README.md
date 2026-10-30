# field-tool-kit

현장 운영 도구(점검·인수인계·리포트·집계) 과제를 코딩 에이전트와 함께 빠르게 시작하기 위한 범용 스타터 키트.

과제와 무관한 재료만 들어 있다: 작업 규칙(AGENTS.md), 문서 템플릿, 프롬프트 모음, 참고 레포 목록, 그리고 폼·표·차트·CSV·API·테스트가 이미 통과하는 Next.js 뼈대.

## 시작 (과제 작업 폴더에서)

```bash
git clone --depth 1 https://github.com/<계정>/<레포> kit
bash kit/scripts/bootstrap.sh
```

bootstrap이 하는 일: 스타터 앱과 문서를 현재 폴더에 복사(기존 파일은 덮어쓰지 않음) → `npm install` → `npm test` → 첫 커밋. 끝나면 `rm -rf kit`.

그다음:

```bash
npm run dev          # http://0.0.0.0:3000 (미리보기 도구에 PORT 3000, 경로 /)
npm test             # vitest 21개
npm run typecheck
bash scripts/smoke.sh   # 제출 전 서버·API·페이지 살아 있는지
```

## 구성

```
AGENTS.md          코딩 에이전트 작업 규칙 (Codex가 읽음). 과제별 성공 기준을 채우는 칸 있음
PROMPTS.md         인터뷰 질문, 첫 지시, 검증, 리뷰어 세션, 감시 세션, HANDOFF, 서술형 답변 틀
REFERENCES.md      유형별 참고 레포 (존재 확인됨). 필요할 때 clone
CHECKLIST.md       당일 타임박스와 금지 사항
docs/
  AGREEMENT.md     실무자 합의문 (구현 전 필수)
  DECISIONS.md     결정 로그 + "AI 제안 중 내가 바꾼 것"
  HANDOFF.md       세션 인계
  STATE.md         7단계 진행 상태
scripts/
  bootstrap.sh     복사 → install → test → 커밋
  smoke.sh         서버 띄우고 API·페이지 확인
app/               Next.js 16 + React 19 + TypeScript 스타터
  src/lib/schema.ts      zod 스키마 (현장 기록: 날짜·대상·구분·값·메모·작성자)
  src/lib/csv.ts         CSV 읽기·쓰기 (papaparse)
  src/lib/aggregate.ts   집계·비율·추세 (결정론 코어, 분모 0 → null)
  src/lib/store.ts       JSON 파일 저장소 (DB 없음, 원자적 쓰기)
  src/app/api/records/   GET·POST, /import (CSV 부분 성공)
  src/app/page.tsx       서버에서 집계 → 대시보드
  src/components/        DataTable(정렬·필터), RecordForm(zod 검증), TrendChart(recharts)
  tests/                 aggregate · csv · api 21개
  public/sample_records.csv
```

## 과제에 맞추는 순서

1. `src/lib/schema.ts`의 필드명을 과제 용어로 바꾼다 (target → 설비, value → 불량수 등). 타입이 전부 여기서 나온다.
2. `src/lib/aggregate.ts`에 과제가 요구하는 계산을 추가한다. LLM 호출은 여기 넣지 않는다.
3. `src/app/dashboard.tsx`의 컬럼·KPI 라벨을 바꾼다.
4. 저장소가 더 필요하면 `store.ts`만 교체한다. 인터페이스(readAll / append / writeAll)는 유지.
5. 기능 하나 = 테스트 하나 = 커밋 하나.

## 설계 원칙 (AGENTS.md 요약)

- 합의한 문제 하나를 끝-끝으로. 기능 늘리기 금지.
- 판정·계산·집계는 고정 코드. AI는 요약·초안·분류 보조만.
- 서버는 0.0.0.0 바인딩. 입력은 zod. 비밀키·개인정보는 코드·로그 밖.
- 문서에 쓴 것은 코드와 커밋에 있어야 한다.

## 한계

- 저장소는 JSON 파일 1개, 동시 쓰기 보호 없음 (1인 사용 전제).
- 인증 없음. 과제가 요구하면 추가.
- 표는 수천 행까지. 그 이상은 REFERENCES의 TanStack/table 또는 react-window.
- Node 20.9 이상 필요 (Next.js 16).

## 라이선스

MIT. 포함된 코드는 전부 이 레포에서 작성. 외부 레포 코드는 포함하지 않았다.
