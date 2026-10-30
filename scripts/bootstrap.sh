#!/usr/bin/env bash
# 사용법: 과제 작업 폴더(README.md가 있는 곳)에서
#   git clone --depth 1 https://github.com/lukasjinsh/hynix-kit kit
#   bash kit/scripts/bootstrap.sh
#
# 하는 일: 스타터 앱 + AGENTS.md + docs/ + PROMPTS/REFERENCES를 현재 폴더에 복사(기존 파일은 덮어쓰지 않음)
#         → npm install → npm test → git 커밋 안내
set -euo pipefail

KIT="$(cd "$(dirname "$0")/.." && pwd)"
T="${1:-.}"
mkdir -p "$T"
T="$(cd "$T" && pwd)"

echo "▶ 키트: $KIT"
echo "▶ 대상: $T"

# 1. 스타터 앱 (dotfile 포함). 이미 있는 파일은 건너뜀.
cp -rn "$KIT/app/." "$T/" 2>/dev/null || true  # macOS cp -n은 건너뛴 파일이 있으면 exit 1

# 2. 에이전트 규칙 + 문서 템플릿
cp -n "$KIT/AGENTS.md" "$T/AGENTS.md" 2>/dev/null || true
mkdir -p "$T/docs"
cp -n "$KIT"/docs/*.md "$T/docs/" 2>/dev/null || true
cp -n "$KIT/PROMPTS.md" "$T/PROMPTS.md" 2>/dev/null || true
cp -n "$KIT/REFERENCES.md" "$T/REFERENCES.md" 2>/dev/null || true
cp -n "$KIT/CHECKLIST.md" "$T/CHECKLIST.md" 2>/dev/null || true
mkdir -p "$T/scripts"
cp -n "$KIT/scripts/smoke.sh" "$T/scripts/smoke.sh" 2>/dev/null || true
chmod +x "$T/scripts/smoke.sh" 2>/dev/null || true
# 과제 README.md와 충돌하지 않도록 키트 설명은 KIT.md로
cp "$KIT/README.md" "$T/KIT.md"

cd "$T"

# 3. 과제가 이미 package.json을 갖고 있었다면 경고만
if [ -f package.json ] && ! grep -q '"field-tool-starter"' package.json; then
  echo "⚠ 기존 package.json이 있어 스타터 package.json을 덮어쓰지 않았습니다. 의존성을 수동으로 합치세요."
fi

# 4. 설치 + 테스트
echo "▶ node $(node --version)  npm $(npm --version)"
npm install --no-audit --no-fund
npm test

# 5. git (clone해 온 kit 폴더는 커밋에 넣지 않는다)
if [ ! -d .git ]; then git init -q; fi
KIT_REL="$(realpath --relative-to="$T" "$KIT" 2>/dev/null || echo kit)"
case "$KIT_REL" in ..*|/*) ;; *) grep -qx "$KIT_REL/" .gitignore 2>/dev/null || echo "$KIT_REL/" >> .gitignore ;; esac
git add -A
git -c user.name="candidate" -c user.email="candidate@example.com" commit -q -m "chore: 범용 스타터 키트로 시작 (레이아웃·폼·표·차트·CSV·API·테스트 뼈대)" || true

cat <<'MSG'

✔ 준비 완료.

다음 순서:
  1. README.md(과제)를 읽는다. 3분.
  2. 업무 담당자 DM 인터뷰 → docs/AGREEMENT.md 작성 (PROMPTS.md 1번)
  3. codex 실행 → "AGENTS.md를 읽고 요약해 줘" (PROMPTS.md 0번)
  4. npm run dev  → Browser 도구에 PORT 3000, 경로 /  (서버는 0.0.0.0에 바인딩됨)
  5. docs/STATE.md 갱신 + 커밋을 30분마다

키트 폴더는 지워도 된다:  rm -rf kit
MSG
