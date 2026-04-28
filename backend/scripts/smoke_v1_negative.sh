#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://127.0.0.1:8080}"
FAIL=0

log() {
  echo "[smoke_v1_negative] $1"
}

assert_code_and_trace() {
  local label="$1"
  local payload="$2"
  local expected_code="$3"
  if ! printf '%s' "$payload" | python3 -c "import json,sys; d=json.load(sys.stdin); assert d.get('code') == ${expected_code} and d.get('trace_id')"; then
    echo "[smoke_v1_negative] FAIL ${label}: expected code=${expected_code}, got payload=${payload}"
    FAIL=1
  else
    echo "[smoke_v1_negative] PASS ${label}"
  fi
}

extract_field() {
  local payload="$1"
  local expr="$2"
  printf '%s' "$payload" | python3 -c "import json,sys; data=json.load(sys.stdin); print(${expr})"
}

log "BASE_URL=${BASE_URL}"

INIT="$(curl -sS -X POST "${BASE_URL}/api/v1/user/init" -H "Content-Type: application/json" -d '{}')"
assert_code_and_trace "user/init bootstrap" "$INIT" 0
ANON_ID="$(extract_field "$INIT" "data['data']['anonymous_id']")"
TOKEN="$(extract_field "$INIT" "data['data']['token']")"
AUTH="Authorization: Bearer ${TOKEN}"

# 1) user/bind login_code="" => 40001
BIND_EMPTY="$(curl -sS -X POST "${BASE_URL}/api/v1/user/bind" -H "Content-Type: application/json" -H "${AUTH}" -d "{\"anonymous_id\":\"${ANON_ID}\",\"login_code\":\"\"}")"
assert_code_and_trace "user/bind empty login_code" "$BIND_EMPTY" 40001

# 2) user/bind login_code="invalid_code" => 40101
INIT2="$(curl -sS -X POST "${BASE_URL}/api/v1/user/init" -H "Content-Type: application/json" -d '{}')"
assert_code_and_trace "user/init invalid case bootstrap" "$INIT2" 0
ANON2="$(extract_field "$INIT2" "data['data']['anonymous_id']")"
TOKEN2="$(extract_field "$INIT2" "data['data']['token']")"
AUTH2="Authorization: Bearer ${TOKEN2}"
BIND_INVALID="$(curl -sS -X POST "${BASE_URL}/api/v1/user/bind" -H "Content-Type: application/json" -H "${AUTH2}" -d "{\"anonymous_id\":\"${ANON2}\",\"login_code\":\"invalid_code\"}")"
assert_code_and_trace "user/bind invalid login_code" "$BIND_INVALID" 40101

# 3) report/detail not_exist => 40401
REPORT_404="$(curl -sS "${BASE_URL}/api/v1/report/detail?report_id=not_exist" -H "${AUTH}")"
assert_code_and_trace "report/detail not_exist" "$REPORT_404" 40401

if [[ "$FAIL" -eq 0 ]]; then
  echo "PASS"
  exit 0
fi

echo "FAIL"
exit 1
