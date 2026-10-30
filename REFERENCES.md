# REFERENCES

과제 유형별 참고 레포. 전부 2026-10-30 기준 존재 확인함. 통째로 쓰지 말고 패턴·일부 유틸만 참고한다. 가져온 코드는 내 구조에 맞게 고치고 커밋 메시지에 "○○ 참고"라고 남긴다.

clone은 필요할 때 한 번만, 필요한 폴더만 본다:
```
git clone --depth 1 https://github.com/OWNER/REPO /tmp/ref-REPO
ls /tmp/ref-REPO
```

## UI 컴포넌트·레이아웃

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `shadcn-ui/ui` | `apps/v4/registry/new-york-v4/ui/` (table, form, dialog, card) | 복붙 가능한 React 컴포넌트. Tailwind 필요 |
| `satnaing/shadcn-admin` | `src/features/`, `src/components/layout/` | 관리자 대시보드 레이아웃 전체 예시 |
| `shadcn-ui/taxonomy` | `app/(dashboard)/` | Next.js App Router 대시보드 구조 |
| `tremorlabs/tremor` | `src/components/` | 대시보드용 카드·차트·KPI 컴포넌트 |
| `lucide-icons/lucide` | 아이콘 이름 검색 | `lucide-react` 아이콘 |

## 표·데이터 그리드

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `TanStack/table` | `examples/react/basic`, `examples/react/sorting`, `examples/react/filters` | 정렬·필터·페이지네이션 되는 표. 헤드리스 |
| `sadmann7/shadcn-table` | `src/components/data-table/` | TanStack + shadcn 조합 완성형 데이터 테이블 |
| `bvaughn/react-window` | `README` | 행 수천 개일 때 가상 스크롤 |

## 폼·검증

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `colinhacks/zod` | `README` (object, enum, refine, safeParse) | 입력 검증. 키트에 이미 포함 |
| `react-hook-form/react-hook-form` | `examples/` | 복잡한 폼 상태. 간단한 폼이면 불필요 |

## CSV·엑셀·파일

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `mholt/PapaParse` | `README` (parse with header, dynamicTyping, unparse) | CSV 읽기·쓰기. 키트에 이미 포함 |
| `SheetJS/sheetjs` | `docbits/` | xlsx 읽기가 꼭 필요할 때만. 무겁다 |

## 차트

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `recharts/recharts` | `storybook/` 또는 README 예시 (LineChart, BarChart) | 선·막대 차트. 키트에 이미 포함 |

## 일정·칸반·드래그

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `fullcalendar/fullcalendar` | `README`, `@fullcalendar/react` | 교대·PM 일정 달력 |
| `hello-pangea/dnd` | `stories/` | 칸반·우선순위 드래그 정렬 (react-beautiful-dnd 후속) |
| `react-grid-layout/react-grid-layout` | `test/examples/` | 대시보드 위젯 배치 |

## 상태·데이터 패칭

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `pmndrs/zustand` | `README` | 전역 상태가 필요할 때. 작으면 useState로 충분 |
| `TanStack/query` | `examples/react/basic` | 서버 데이터 캐싱·재조회 |
| `uidotdev/usehooks` | `index.js` | useLocalStorage, useDebounce 등 훅 모음 |

## 날짜

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `date-fns/date-fns` | `README` | 날짜 계산. 교대·주차 처리 |
| `iamkun/dayjs` | `README` | 더 가벼운 대안 |

## 서버·저장

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `vercel/next.js` | `examples/` (api-routes, with-sqlite 등) | Next.js 공식 예시 모음. 막히면 여기부터 |
| `vercel/next-learn` | `dashboard/final-example/` | Next.js 공식 대시보드 튜토리얼 완성본 |
| `honojs/hono` | `examples/` | Next 밖에 별도 API 서버가 필요할 때 |
| `WiseLibs/better-sqlite3` | `README` | 파일 DB가 꼭 필요할 때. 네이티브 빌드라 샌드박스에서 실패 가능, 키트의 JSON 저장으로 충분하면 쓰지 않는다 |

## AI 호출 (보조 용도로만)

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `vercel/ai` | `examples/next-openai/` | LLM 호출을 UI에 붙일 때. 판정·계산에는 쓰지 않는다 (AGENTS.md 원칙 2) |

## 테스트

| 레포 | 볼 곳 | 용도 |
| --- | --- | --- |
| `vitest-dev/vitest` | `examples/` | 단위 테스트. 키트에 이미 포함 |
| `microsoft/playwright` | `docs/` | E2E. 브라우저 자동 조작은 "Computer Use 금지"와 헷갈릴 수 있으니 사전체험에서 Cofa Helper에 확인 전엔 쓰지 않는다 |
