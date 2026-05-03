#!/usr/bin/env bash
# 可选：在「安全」的 git 状态下自动暂存并 commit，再调用 backup-to-github.sh。
# 供 launchd / fswatch 定时或事件触发；不在仓库内存放密钥。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "错误: 无法解析 git 仓库根目录。" >&2
  exit 1
fi

BACKUP_ARGS=()
DRY_RUN=0

usage() {
  cat <<'EOF'
用法: autosave-and-backup.sh [选项]

在可安全自动提交的状态下（非 detached、非 merge/rebase/cherry-pick）：
  - 若有未提交变更：git add -A 并 chore(autosave) 提交
  - 随后调用 backup-to-github.sh 推送到备份远程

选项（透传给 backup-to-github.sh）:
  --dry-run     不执行自动 commit；推送阶段使用 git push --dry-run（脏工作区时会加 --allow-dirty）
  -h, --help    显示本说明

环境变量:
  AIHUFU_BACKUP_REMOTE       同 backup-to-github.sh
  AIHUFU_BACKUP_PUSH_ALL     同 backup-to-github.sh
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; BACKUP_ARGS+=(--dry-run); shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "未知参数: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

cd "$REPO_ROOT"

git_safe_for_autosave() {
  if ! git symbolic-ref -q HEAD &>/dev/null; then
    echo "[autosave] 跳过: detached HEAD。" >&2
    return 1
  fi
  if [[ -f .git/MERGE_HEAD ]]; then
    echo "[autosave] 跳过: merge 进行中。" >&2
    return 1
  fi
  if [[ -d .git/rebase-merge ]] || [[ -d .git/rebase-apply ]]; then
    echo "[autosave] 跳过: rebase 进行中。" >&2
    return 1
  fi
  if [[ -f .git/CHERRY_PICK_HEAD ]]; then
    echo "[autosave] 跳过: cherry-pick 进行中。" >&2
    return 1
  fi
  return 0
}

if ! git_safe_for_autosave; then
  exit 0
fi

REMOTE_NAME="${AIHUFU_BACKUP_REMOTE:-backup}"
if ! git remote get-url "$REMOTE_NAME" &>/dev/null; then
  echo "错误: 未找到名为「${REMOTE_NAME}」的 git remote。" >&2
  exit 1
fi

ALLOW_DIRTY_FLAG=()
if [[ "$DRY_RUN" -eq 1 ]]; then
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    echo "[autosave] --dry-run：跳过自动 commit；使用 --allow-dirty 仅校验推送。" >&2
    ALLOW_DIRTY_FLAG=(--allow-dirty)
  fi
else
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    git add -A
    if git diff --cached --quiet; then
      echo "[autosave] 无可暂存变更（可能均为忽略项），跳过 commit。"
    else
      msg="chore(autosave): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
      git commit -m "$msg"
    fi
  fi
  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    echo "[autosave] 警告: 仍有未提交变更，将使用 --allow-dirty 仅推送已有提交。" >&2
    ALLOW_DIRTY_FLAG=(--allow-dirty)
  fi
fi

exec "$SCRIPT_DIR/backup-to-github.sh" "${ALLOW_DIRTY_FLAG[@]}" "${BACKUP_ARGS[@]}"
