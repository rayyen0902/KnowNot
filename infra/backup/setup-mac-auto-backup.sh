#!/usr/bin/env bash
# 一键：在本机注册 launchd，定时执行 autosave-and-backup（约每 6 小时）。
# 需在 monorepo 内执行；不写入任何密钥。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "${REPO_ROOT}" ]]; then
  echo "错误: 请在 AIhufu 仓库内执行本脚本。" >&2
  exit 1
fi

REMOTE="${AIHUFU_BACKUP_REMOTE:-backup}"
if ! git -C "$REPO_ROOT" remote get-url "$REMOTE" &>/dev/null; then
  cat <<EOF >&2
错误: 未找到名为「${REMOTE}」的 git remote。

请先在本仓库执行一次（把地址换成你的 GitHub 私有仓 SSH 地址）：
  git remote add ${REMOTE} git@github.com:YOUR_ORG/YOUR_REPO.git
EOF
  exit 1
fi

escape_xml() {
  local s="$1"
  s="${s//&/&amp;}"
  s="${s//</&lt;}"
  s="${s//>/&gt;}"
  printf '%s' "$s"
}

REPO_X="$(escape_xml "$REPO_ROOT")"
AUTO_X="$(escape_xml "$REPO_ROOT/infra/backup/autosave-and-backup.sh")"
OUT_X="$(escape_xml "$REPO_ROOT/infra/backup/.launchd.out.log")"
ERR_X="$(escape_xml "$REPO_ROOT/infra/backup/.launchd.err.log")"

PLIST="$HOME/Library/LaunchAgents/com.aihufu.autosave-backup.plist"
mkdir -p "$(dirname "$PLIST")"

cat >"$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.aihufu.autosave-backup</string>
  <key>StartInterval</key>
  <integer>21600</integer>
  <key>RunAtLoad</key>
  <true/>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>${AUTO_X}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${REPO_X}</string>
  <key>StandardOutPath</key>
  <string>${OUT_X}</string>
  <key>StandardErrorPath</key>
  <string>${ERR_X}</string>
</dict>
</plist>
EOF

chmod +x "$REPO_ROOT/infra/backup/autosave-and-backup.sh" "$REPO_ROOT/infra/backup/backup-to-github.sh" 2>/dev/null || true

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load -w "$PLIST"

cat <<EOF

已完成：本机已注册定时任务（约每 6 小时一次；登录后也会尽快跑一轮）。
备份远程名：${REMOTE}
plist：${PLIST}

关闭自动备份：
  launchctl unload "$PLIST"

立刻手动跑一次（可选）：
  cd $(printf '%q' "$REPO_ROOT") && ./infra/backup/autosave-and-backup.sh
EOF
