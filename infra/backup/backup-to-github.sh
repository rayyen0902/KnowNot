#!/usr/bin/env bash
# 可选：将当前仓库推送到已配置的 GitHub 远程作为备份。
# 不在仓库中存放任何令牌；远程 URL 由 Owner 本机 git remote 配置或环境变量提供。
set -euo pipefail

REMOTE_NAME="${AIHUFU_BACKUP_REMOTE:-backup}"
DRY_RUN=0
ALLOW_DIRTY=0

usage() {
  cat <<'EOF'
用法: backup-to-github.sh [选项]

将本地分支与标签推送到指定 git remote（默认名称: backup，可用 AIHUFU_BACKUP_REMOTE 覆盖）。

选项:
  --dry-run       使用 git push --dry-run，校验推送但不写入远程
  --allow-dirty   工作区有未提交变更时仍继续（默认会退出并提示先提交或 stash）
  -h, --help      显示本说明

环境变量:
  AIHUFU_BACKUP_REMOTE      远程名称，默认 backup
  AIHUFU_BACKUP_PUSH_ALL    设为 0 时只推送当前分支（仍推送 --tags）；默认 1 表示推送全部分支与标签

前置条件:
  在本机已为该仓库添加远程，例如:
    git remote add backup git@github.com:YOUR_ORG/YOUR_PRIVATE_MIRROR.git

安全建议:
  优先使用 SSH 地址；勿把 PAT 写进可被 git 提交的 remote URL。
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1; shift ;;
    --allow-dirty) ALLOW_DIRTY=1; shift ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "未知参数: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "错误: 无法在脚本所在目录解析 git 仓库根目录。" >&2
  exit 1
fi

cd "$REPO_ROOT"

if ! git remote get-url "$REMOTE_NAME" &>/dev/null; then
  echo "错误: 未找到名为「${REMOTE_NAME}」的 git remote。" >&2
  echo "请先添加，例如: git remote add ${REMOTE_NAME} git@github.com:YOUR_ORG/YOUR_REPO.git" >&2
  exit 1
fi

if [[ -n "$(git status --porcelain 2>/dev/null)" && "$ALLOW_DIRTY" -ne 1 ]]; then
  echo "错误: 工作区存在未提交变更。请先 commit / stash，或使用 --allow-dirty 跳过此检查。" >&2
  exit 1
fi

echo "仓库根目录: $REPO_ROOT"
echo "备份远程:   $REMOTE_NAME ($(git remote get-url "$REMOTE_NAME"))"

push_cmd=(git push)
if [[ "$DRY_RUN" -eq 1 ]]; then
  push_cmd+=(--dry-run)
  echo "使用 git push --dry-run（不向远程写入）。"
fi
push_cmd+=("$REMOTE_NAME")

PUSH_ALL="${AIHUFU_BACKUP_PUSH_ALL:-1}"
if [[ "$PUSH_ALL" == "0" ]]; then
  branch="$(git branch --show-current 2>/dev/null || true)"
  if [[ -z "${branch}" ]]; then
    echo "错误: AIHUFU_BACKUP_PUSH_ALL=0 时需要已检出的分支名（非 detached HEAD）。" >&2
    exit 1
  fi
  "${push_cmd[@]}" "$branch"
else
  "${push_cmd[@]}" --all
fi
"${push_cmd[@]}" --tags

if [[ "$DRY_RUN" -eq 1 ]]; then
  echo "dry-run 结束，远程未被修改。"
else
  echo "已完成推送到「${REMOTE_NAME}」。"
fi
