# WorkBuddy Skills 仓库

WorkBuddy（CodeBuddy）技能集合，按分类管理，支持一键远程安装。

## 目录结构

| 分类 | 说明 | 包含技能 |
|------|------|----------|
| `global/` | 全局通用技能（推荐所有项目安装） | Deep Research、Impeccable、agent-self-improvement、document-skills、docx、findskill、frontend-design-3、planning-files、quack-code-review、self-improving、skill-scanner、web-search、业务调研报告撰写、提示词工程专家 |
| `coding/` | 编程开发 | AI交叉审查、github、全栈开发、笔记搜索 |
| `office/` | 办公文档 | obsidian、pdf、pdfkit-py、pptx、xlsx、周报生成 |
| `ai-creation/` | AI 创作 | AIHOT、image-generation、local-whisper、yt-dlp-downloader、携程问道 |

---

## 安装方式

### 一键远程安装（推荐）

无需手动 clone，脚本自动从 GitHub 拉取 → 拷贝 skill → 清理临时文件。

```bash
# 全量安装（所有分类）
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone

# 按场景组合安装
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone global coding
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone global office
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone global ai-creation

# 安装单个技能
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone --skill coding/github
```

```powershell
# Windows PowerShell — 全量安装
iex ((New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.ps1')); Install-Skills -Clone

# Windows — 按分类安装（需先手动执行一次 clone）
git clone --depth 1 https://github.com/bitcjm/workbuddy-skills.git $env:TEMP\workbuddy-skills
& "$env:TEMP\workbuddy-skills\install.ps1" global coding
Remove-Item -Recurse -Force "$env:TEMP\workbuddy-skills"
```

### 本地安装（已 clone 仓库）

```bash
# 全量
bash install.sh

# 按分类
bash install.sh global coding

# 单个技能
bash install.sh --skill coding/github

# 装到项目级 .workbuddy/skills/
bash install.sh --project global coding
```

```powershell
# 全量
.\install.ps1

# 按分类
.\install.ps1 global coding

# 单个技能
.\install.ps1 -Skill coding/github

# 装到项目级
.\install.ps1 -Project global coding
```

### 用户级 vs 项目级

| 维度 | 用户级 `~/.workbuddy/skills/` | 项目级 `.workbuddy/skills/` |
|------|------|------|
| 作用范围 | 所有项目共享 | 仅当前项目 |
| 优先级 | 低 | **高**（同名覆盖用户级） |
| 适合装 | 通用技能 | 项目专属技能 |
| 版本管理 | 不进 Git | 可随项目提交 |

> **去重规则**：同名技能项目级优先，不会重复加载。

---

## AI 自动安装指令

> 本节供 AI Agent 读取并执行。当用户要求安装 WorkBuddy Skills 时，AI 应按以下步骤操作。

### 场景：用户说"装一下 skill" / "安装 skills" / 给了本仓库链接

**步骤**：

1. 确认用户要安装到**用户级**（默认）还是**项目级**
2. 确认要安装的**分类**（未指定则装 `global`，即通用技能）
3. 在当前项目目录下执行对应命令

**macOS / Linux / Git Bash 执行**：

```bash
# 全量安装到用户级
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone

# 只装通用技能到用户级
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone global

# 装通用+编程到项目级
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone --project global coding

# 装单个技能
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone --skill coding/github
```

**Windows 执行**：

```powershell
# 1. 克隆到临时目录
git clone --depth 1 https://github.com/bitcjm/workbuddy-skills.git $env:TEMP\workbuddy-skills

# 2. 执行安装（替换参数按需调整）
& "$env:TEMP\workbuddy-skills\install.ps1" -Clone global coding

# 3. 清理临时目录
Remove-Item -Recurse -Force "$env:TEMP\workbuddy-skills"
```

**可选分类**：`global` | `office` | `coding` | `ai-creation`

**可选技能路径**（用于 `--skill` 参数）：`<分类>/<技能文件夹名>`，如 `coding/github`、`office/周报生成`

---

## 查看已安装技能

在 WorkBuddy 对话中输入 `/skills`，可查看当前加载的所有技能及其来源。

## 更新

```bash
# 重新执行安装命令即可覆盖更新
bash <(curl -sL https://raw.githubusercontent.com/bitcjm/workbuddy-skills/main/install.sh) --clone global
```

## 贡献技能

1. 在对应分类目录下创建技能文件夹（含 `SKILL.md`）
2. 测试通过后提交：

```bash
git add .
git commit -m "feat(coding): 新增代码优化技能"
git push
```

---

详细管理指南见 [WorkBuddy-Skill-GitHub管理指南.md](./WorkBuddy-Skill-GitHub管理指南.md)
