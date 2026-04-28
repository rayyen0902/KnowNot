#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"
FAIL=0

log() {
  echo "[smoke_v1] $1"
}

assert_payload() {
  local label="$1"
  local payload="$2"
  local check="$3"
  if ! printf '%s' "$payload" | python3 -c "$check" >/dev/null 2>&1; then
    echo "[smoke_v1] FAIL ${label}: ${payload}"
    FAIL=1
  else
    echo "[smoke_v1] PASS ${label}"
  fi
}

extract_field() {
  local payload="$1"
  local expr="$2"
  printf '%s' "$payload" | python3 -c "import json,sys; data=json.load(sys.stdin); print(${expr})"
}

log "BASE_URL=${BASE_URL}"

INIT="$(curl -sS -X POST "${BASE_URL}/api/v1/user/init" -H "Content-Type: application/json" -d '{}')"
assert_payload "user/init code+trace" "$INIT" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id')"
ANON_ID="$(extract_field "$INIT" "data['data']['anonymous_id']")"
TOKEN="$(extract_field "$INIT" "data['data']['token']")"
AUTH="Authorization: Bearer ${TOKEN}"

SESSION="$(curl -sS -X POST "${BASE_URL}/api/v1/session/start" -H "Content-Type: application/json" -H "${AUTH}" -d "{\"anonymous_id\":\"${ANON_ID}\"}")"
assert_payload "session/start code+trace" "$SESSION" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id') and d['data'].get('session_id')"
SESSION_ID="$(extract_field "$SESSION" "data['data']['session_id']")"

CREATE="$(curl -sS -X POST "${BASE_URL}/api/v1/report/task/create" -H "Content-Type: application/json" -H "${AUTH}" -d "{\"session_id\":\"${SESSION_ID}\",\"profile\":{\"skin_type\":\"combination\",\"wash_time\":\"morning_night\",\"makeup_habit\":\"light\",\"routine_steps\":[\"cleanser\"],\"allergy_input\":\"\",\"allergy_preset\":[\"none\"]}}")"
assert_payload "task/create code+trace" "$CREATE" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id') and d['data'].get('task_id')"
TASK_ID="$(extract_field "$CREATE" "data['data']['task_id']")"

STATUS=""
for _ in 1 2 3 4 5; do
  STATUS="$(curl -sS "${BASE_URL}/api/v1/report/task/status?task_id=${TASK_ID}" -H "${AUTH}")"
  assert_payload "task/status code+trace+state" "$STATUS" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id') and d['data'].get('state')"
  STATE="$(extract_field "$STATUS" "data['data']['state']")"
  if [[ "$STATE" == "done" ]]; then
    break
  fi
  sleep 1
done

if [[ "$STATE" != "done" ]]; then
  echo "[smoke_v1] FAIL task/status final state=${STATE}"
  FAIL=1
fi

REPORT_ID="$(extract_field "$STATUS" "data['data'].get('report_id','')")"
if [[ -z "$REPORT_ID" ]]; then
  echo "[smoke_v1] FAIL report_id missing in done status"
  FAIL=1
fi

DETAIL="$(curl -sS "${BASE_URL}/api/v1/report/detail?report_id=${REPORT_ID}" -H "${AUTH}")"
assert_payload "report/detail code+trace" "$DETAIL" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id') and d['data'].get('report_id')"

BIND="$(curl -sS -X POST "${BASE_URL}/api/v1/user/bind" -H "Content-Type: application/json" -H "${AUTH}" -d "{\"anonymous_id\":\"${ANON_ID}\",\"login_code\":\"ok_code\"}")"
assert_payload "user/bind code+trace" "$BIND" "import json,sys; d=json.load(sys.stdin); assert d['code']==0 and d.get('trace_id') and d['data'].get('user_id') and d['data'].get('token')"

if [[ "$FAIL" -eq 0 ]]; then
  echo "PASS"
  exit 0
fi

echo "FAIL"
exit 1
