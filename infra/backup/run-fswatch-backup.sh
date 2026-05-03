#!/usr/bin/env bash
# 可选：用 fswatch 监听仓库根目录，按批（latency）触发 autosave-and-backup.sh。
# 需本机: brew install fswatch
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "错误: 无法解析 git 仓库根目录。" >&2
  exit 1
fi

DEBOUNCE_SEC="${AIHUFU_BACKUP_DEBOUNCE_SEC:-60}"

usage() {
  cat <<'EOF'
用法: run-fswatch-backup.sh [选项]

使用 fswatch 监听 monorepo 根目录；在 AIHUFU_BACKUP_DEBOUNCE_SEC 秒（默认 60）内合并事件后，
触发一次 autosave-and-backup.sh。

额外参数会透传给 autosave-and-backup.sh（例如 --dry-run）。

环境变量:
  AIHUFU_BACKUP_DEBOUNCE_SEC   合并窗口秒数，默认 60

依赖:
  brew install fswatch
EOF
}

FORWARD=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help) usage; exit 0 ;;
    *) FORWARD+=("$1"); shift ;;
  esac
done

if ! command -v fswatch &>/dev/null; then
  echo "错误: 未找到 fswatch。请执行: brew install fswatch" >&2
  exit 1
fi

echo "[fswatch-backup] 监听: $REPO_ROOT"
echo "[fswatch-backup] 防抖: ${DEBOUNCE_SEC}s；Ctrl+C 结束。"

# --batch-marker: 每个 latency 窗口结束时输出一行，避免「每个路径一行」导致频繁触发
fswatch -r \
  -l "$DEBOUNCE_SEC" \
  --batch-marker \
  -e '/\.git($|/)' \
  -e '/node_modules($|/)' \
  -e '/dist($|/)' \
  -e '/build($|/)' \
  -e '/\.temp($|/)' \
  -e '/\.cache($|/)' \
  -e '/\.swc($|/)' \
  "$REPO_ROOT" | while read -r _marker; do
  if ! /bin/bash "$SCRIPT_DIR/autosave-and-backup.sh" "${FORWARD[@]}"; then
    echo "[fswatch-backup] 本轮 autosave-and-backup 失败（已忽略，继续监听）。" >&2
  fi
done
