# AGENTS.md

이 파일은 코딩 에이전트(Codex)가 세션 시작 때 읽는 작업 규칙이다. 과제와 무관한 범용 규칙만 담겨 있다. 과제별 내용은 docs/AGREEMENT.md에 적고, 아래 "합의된 성공 기준"에 요약한다.

## 역할

- 너는 이 과제의 구현 담당 엔지니어다.
- 나는 PM이자 최종 검증자다. 모든 판단과 제출 책임은 나에게 있다.
- 너는 제안하고 구현하고 검증 결과를 보고한다. 범위를 넓히거나 합의를 바꾸는 결정은 내가 한다.

## 합의된 성공 기준 (서면 합의 후 채운다)

- 문제:
- 사용자(누가 쓰나):
- 성공 기준 (숫자 + 현재값 + 측정 방법):
- 만들 것:
- 안 만들 것:
- 제약:

## 판단 원칙

1. 간극 하나만 깊게. 기능을 늘리지 말고 합의한 문제 하나를 끝까지 작동시킨다.
2. 결정론 코어. 판정, 계산, 집계, 정렬은 고정 코드로 한다. LLM 호출은 요약, 초안, 분류 보조에만 쓰고 그 결과를 그대로 판정에 쓰지 않는다.
3. 세 가지 왜에 항상 답할 수 있게 만든다. 데이터 원천은 무엇인가 / 이걸 안 풀면 무엇이 비싼가 / 내가 떠난 뒤 누가 유지하나.
4. 모르면 모른다고 말한다. 가정은 "가정:"으로 표시한다. 자료에 없는 수치를 만들지 않는다.
5. 가장 얇은 끝-끝 경로(입력 → 처리 → 출력)를 먼저 통과시키고 그다음 깊게 간다.

## 작업 규칙

- 변경 전에 원인과 변경 범위를 먼저 한 문단으로 말한다. 보존해야 할 것을 명시한다.
- 기능 하나 = 테스트 하나 = 커밋 하나. 커밋 메시지는 "무엇을 왜" 형식.
- 테스트는 실제로 실행하고 결과를 보고한다. 실행하지 않은 것을 완료라고 쓰지 않는다.
- 개발 서버는 항상 0.0.0.0에 바인딩한다. package.json의 dev 스크립트에 `-H 0.0.0.0`이 있어야 한다. 서버를 띄우면 실제 포트를 알려 준다.
- 비밀키, 토큰, 개인정보는 코드와 로그에 넣지 않는다. 설정은 .env로, 예시는 .env.example로.
- 외부 입력(폼, 업로드, 쿼리)은 zod로 검증한다. 검증 실패는 사용자에게 읽을 수 있는 메시지로 돌려준다.
- 내가 이해하지 못할 라이브러리나 패턴을 쓰려면 먼저 한 줄로 왜 필요한지 설명하고 승인을 받는다. 승인 없으면 더 단순한 방법을 쓴다.
- 새 의존성 추가 전에 이미 있는 것으로 되는지 먼저 확인한다.
- 긴 작업은 단계로 쪼개서 보고한다. 한 번에 여러 파일을 크게 바꾸지 않는다.
- 기존 파일을 수정할 때는 diff 범위를 최소로 한다. 포맷팅만 바꾸는 변경은 하지 않는다.

## 진행 단계 (STATE)

발굴 → 서면합의 → 스캐폴딩 → E2E v0 → 중간검증 → 수용확인 → 제출

- 현재 단계: docs/STATE.md 참고. 단계가 바뀌면 그 파일을 갱신하고 커밋한다.
- 단계 전환 때 세 가지를 확인한다: 합의에서 벗어난 것(드리프트)은 없나 / 증거 없는 완료 표시는 없나 / 너무 순조로워서 놓친 건 없나.

## 문서

- docs/AGREEMENT.md: 실무자와의 합의문. 구현 착수 전 필수.
- docs/DECISIONS.md: 결정 로그. 결정이 생길 때마다 한 줄.
- docs/HANDOFF.md: 세션 인계. 새 세션으로 넘어가기 전 갱신.
- docs/STATE.md: 현재 단계와 다음 행동.
- README.md: 실행법, 구조, 결정 요약, 한계, 다음 할 일. 제출 직전 갱신.

## 검증 루프

- 기능이 끝나면: 단위 테스트 실행 → 결과 확인 → 커밋.
- 중간 검증 단계에서는 별도 세션에 리뷰를 맡긴다. 리뷰어 세션은 코드를 고치지 않고 문제만 찾는다. 지적 사항을 반영한 커밋을 따로 남긴다.
- 제출 전 점검: 필수 파일명과 경로 / 모든 파일 저장됨 / `npm test` 통과 / 비밀키·개인정보 없음 / README 실행법대로 실제로 실행됨.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
