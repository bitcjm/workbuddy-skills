# 🧠 WorkBuddy Skills 仓库

个人 WorkBuddy Skills 集合，按分类管理，支持一键部署到新环境。

## 目录结构

| 目录 | 用途 | 数量 |
|------|------|------|
| `global/` | 全局通用技能（必装） | 8 个 |
| `office/` | 办公文档相关 | 4 个 |
| `coding/` | 编程开发相关 | 7 个 |
| `ai-creation/` | AI 创作相关 | 5 个 |
| `stock/` | 炒股金融（待补充） | — |
| `archive/` | 归档 | — |

## 一键安装

### Windows（PowerShell）
```powershell
powershell -ExecutionPolicy Bypass -File install-all.ps1
```

### macOS / Linux / Git Bash
```bash
bash install-all.sh
```

## 更新流程

```bash
# 修改本地 Skill 后同步到仓库
cp -r ~/.workbuddy/skills/某技能 ./office/
git add .
git commit -m "feat(office): 更新某技能"
git push
```

新环境：先 clone 再运行安装脚本即可。

---

详细管理指南见 [WorkBuddy-Skill-GitHub管理指南.md](./WorkBuddy-Skill-GitHub管理指南.md)