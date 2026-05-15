# WorkBuddy Skills 仓库

个人 WorkBuddy Skills 集合，按分类管理，支持灵活安装。

## 目录结构

| 分类 | 说明 | 包含技能 |
|------|------|----------|
| `global/` | 全局通用技能（推荐所有项目安装） | Deep Research、Impeccable（前端设计工具集）、agent-self-improvement、document-skills、docx、findskill、frontend-design-3、planning-files、quack-code-review、self-improving、skill-scanner、web-search、业务调研报告撰写、提示词工程专家 |
| `coding/` | 编程开发 | AI交叉审查、github、全栈开发、笔记搜索 |
| `office/` | 办公文档 | obsidian、pdf、pdfkit-py、pptx、xlsx、周报生成 |
| `ai-creation/` | AI 创作 | AIHOT、image-generation、local-whisper、yt-dlp-downloader、携程问道 |

## 安装方式

> 所有脚本将技能安装到用户级目录 `~/.workbuddy/skills/`。
> 如需安装到项目级，加 `--project` 参数。

### 1. 全量安装

安装所有分类下的全部技能。

```bash
# macOS / Linux / Git Bash
bash install.sh

# Windows PowerShell
.\install.ps1
```

### 2. 按分类安装

只装某个分类下的技能：

```bash
# macOS / Linux / Git Bash
bash install.sh global           # 只装全局通用
bash install.sh coding           # 只装编程开发
bash install.sh office           # 只装办公文档
bash install.sh ai-creation      # 只装 AI 创作
```

```powershell
# Windows PowerShell
.\install.ps1 global
.\install.ps1 coding
.\install.ps1 office
.\install.ps1 ai-creation
```

### 3. 按场景组合安装

一次安装多个分类，适合特定工作场景：

```bash
# 场景：全栈开发（通用 + 编程）
bash install.sh global coding

# 场景：办公达人（通用 + 办公）
bash install.sh global office

# 场景：AI 创作者（通用 + AI 创作）
bash install.sh global ai-creation

# 场景：全栈 + 办公 + AI 创作（不装 stock 等）
bash install.sh global coding office ai-creation
```

```powershell
# Windows 同理
.\install.ps1 global coding
.\install.ps1 global office
```

### 4. 安装单个技能

精确安装某个技能：

```bash
# macOS / Linux / Git Bash
bash install.sh --skill coding/github              # 按分类/技能名
bash install.sh --skill office/周报生成

# Windows PowerShell
.\install.ps1 -Skill coding/github
.\install.ps1 -Skill office/周报生成
```

### 5. 安装到项目级

项目级技能仅对当前项目生效，优先级高于用户级（同名技能以项目级为准）：

```bash
# macOS / Linux / Git Bash
bash install.sh --project global coding       # 通用+编程装到项目级
bash install.sh --project --skill coding/github  # 单个技能装到项目级

# Windows PowerShell
.\install.ps1 -Project global coding
.\install.ps1 -Project -Skill coding/github
```

### 用户级 vs 项目级

| 维度 | 用户级 `~/.workbuddy/skills/` | 项目级 `.workbuddy/skills/` |
|------|------|------|
| 作用范围 | 所有项目共享 | 仅当前项目 |
| 优先级 | 低 | **高**（同名覆盖用户级） |
| 适合装 | 通用技能（web-search、findskill 等） | 项目专属技能（项目特定的代码审查、报告生成等） |
| 版本管理 | 不进 Git | 可随项目提交 |

> **去重规则**：当用户级和项目级存在同名技能时，**项目级优先**。AI 匹配时只使用项目级版本，用户级的同名技能不会被重复加载。

## 查看已安装技能

在 WorkBuddy 对话中输入 `/skills`，可查看当前加载的所有技能及其来源（用户级 / 项目级 / 插件级）。

## 更新流程

```bash
# 从仓库拉取最新
git pull

# 重新安装（覆盖更新）
bash install.sh              # 全量更新
bash install.sh global       # 只更新通用类
```

## 贡献技能

1. 在对应分类目录下创建技能文件夹（含 `SKILL.md`）
2. 本地测试通过后提交：

```bash
git add .
git commit -m "feat(coding): 新增代码优化技能"
git push
```

---

详细管理指南见 [WorkBuddy-Skill-GitHub管理指南.md](./WorkBuddy-Skill-GitHub管理指南.md)
