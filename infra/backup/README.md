# 本地备份到 GitHub 远程（可选）

把本仓库 **额外推一份** 到你自己的 GitHub 私有仓。**仓库里不写任何密钥**；远程地址只在你本机的 `git remote`。

---

## 最简单做法（推荐，macOS）

你只要做 **两件事**，之后 **不用再管**（系统会定时自动 commit + 推送）。

### 1）加一次备份远程

在 **AIhufu 仓库根目录** 执行（把 URL 换成你的 **私有** 仓，建议 SSH）：

```bash
git remote add backup git@github.com:YOUR_ORG/YOUR_PRIVATE_REPO.git
```

远程名必须是 **`backup`**（除非你改环境变量，见文末进阶）。

### 2）一键注册定时任务

仍在仓库根目录：

```bash
chmod +x ./infra/backup/setup-mac-auto-backup.sh
./infra/backup/setup-mac-auto-backup.sh
```

脚本会：自动填好路径、写入 `~/Library/LaunchAgents/com.aihufu.autosave-backup.plist`、加载 `launchd`。  
之后大约 **每 6 小时** 跑一次：有未提交改动就先 **自动 commit**，再 **推到 `backup` 远程**；登录后也会 **尽快跑一轮**（`RunAtLoad`）。

**关掉自动备份**：

```bash
launchctl unload ~/Library/LaunchAgents/com.aihufu.autosave-backup.plist
```

**想立刻试一次**（可选）：

```bash
./infra/backup/autosave-and-backup.sh
```

**必须知道的一句风险**：自动 commit 依赖根目录 [`.gitignore`](../../.gitignore)。请确认 `.env`、密钥、大体积产物 **已被忽略**，否则可能误提交。

---

## 手动推送（不用定时、不自动 commit）

工作区干净时：

```bash
./infra/backup/backup-to-github.sh --dry-run   # 只演练推送
./infra/backup/backup-to-github.sh
```

有未提交改动时，基础脚本会拒绝；可先看「最简单做法」用自动流程，或加 `--allow-dirty`（只推已有提交，脏文件仍留在本机）。

---

## 安全原则（简版）

1. 远程用 **SSH**（`git@github.com:…`），用本机 SSH key。  
2. **不要**在 remote URL 里写 PAT。  
3. 不要把含密钥的 `.env` 提交进 git。

---

## 进阶参考（一般不用看）

<details>
<summary>点开展开：脚本说明、fswatch 即时备份、环境变量、手动 plist、排错表</summary>

### 脚本分工

| 脚本 | 作用 |
|------|------|
| [`setup-mac-auto-backup.sh`](./setup-mac-auto-backup.sh) | 一键注册 `launchd`（推荐入口） |
| [`autosave-and-backup.sh`](./autosave-and-backup.sh) | 安全闸 + 自动 commit + 调 `backup-to-github.sh` |
| [`backup-to-github.sh`](./backup-to-github.sh) | 只负责 `git push`（默认全部分支 + tags） |
| [`run-fswatch-backup.sh`](./run-fswatch-backup.sh) | 需 `brew install fswatch`；保存后按防抖触发备份（更即时，也更折腾） |

### 环境变量

| 变量 | 默认 | 说明 |
|------|------|------|
| `AIHUFU_BACKUP_REMOTE` | `backup` | 备份远程名 |
| `AIHUFU_BACKUP_PUSH_ALL` | `1` | `0` 时只推当前分支（仍推 tags） |
| `AIHUFU_BACKUP_DEBOUNCE_SEC` | `60` | 仅 `run-fswatch-backup.sh`：合并事件秒数 |

### fswatch（可选，更「一改就备」）

```bash
brew install fswatch
./infra/backup/run-fswatch-backup.sh
```

### 不用一键脚本、手写 plist

可复制 [`com.aihufu.backup.example.plist`](./com.aihufu.backup.example.plist)，把其中 **`/REPO_PLACEHOLDER`** 换成你的仓库绝对路径，再 `launchctl load`。

### 排错

| 现象 | 处理 |
|------|------|
| 未找到 `backup` remote | 按上文 `git remote add backup …` |
| `Permission denied (publickey)` | `ssh -T git@github.com` 与 SSH key |
| `failed to push some refs` | 备份仓建议用空库起步；不自动 `--force` |
| `fswatch: unrecognized option: batch-marker` | 升级 `fswatch` |

merge / rebase / cherry-pick / detached HEAD 时，`autosave-and-backup.sh` 会整轮跳过，不破坏你的 Git 操作。

</details>

---

## 与本仓库其它文档

根目录 [`README.md`](../../README.md)、[`docs/team-roles.md`](../../docs/team-roles.md) 中 **【运维发布 DevOps】**。
