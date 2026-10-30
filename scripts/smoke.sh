#!/usr/bin/env bash
# 서버를 띄우고 핵심 경로가 살아 있는지 30초 안에 확인한다. 제출 전 마지막 점검용.
#   bash scripts/smoke.sh   (프로젝트 루트에서)
set -euo pipefail
PORT="${PORT:-3000}"
LOG="$(mktemp)"

npm run dev >"$LOG" 2>&1 &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT

for i in $(seq 1 30); do
  if grep -q "Ready" "$LOG" 2>/dev/null; then break; fi
  sleep 1
done

echo "▶ 바인딩 확인"
grep -E "Local|Network" "$LOG" || { echo "서버가 뜨지 않았습니다"; cat "$LOG"; exit 1; }
grep -q "0.0.0.0" "$LOG" || echo "⚠ 0.0.0.0 바인딩이 아닙니다. Browser 도구에서 안 열릴 수 있습니다."

echo "▶ GET /api/records"
curl -sf "http://0.0.0.0:$PORT/api/records" | head -c 200; echo

echo "▶ GET /"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://0.0.0.0:$PORT/")
echo "HTTP $STATUS"
[ "$STATUS" = "200" ] || { echo "메인 페이지가 200이 아닙니다"; exit 1; }

echo "✔ smoke OK"
