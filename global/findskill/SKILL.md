***

name: findskill
version: 1.0.4
description: 智能搜索和发现 OpenClaw 技能，支持中英双语，多来源搜索
homepage: <https://clawhub.ai>
metadata:
openclaw:
emoji: "🔍"
requires:
bins: \[]
---------

# FindSkill 技能包

## 简介

FindSkill 是一个强大的 OpenClaw 技能搜索和发现工具，帮助用户快速找到所需的技能包。

## 功能特点

- **智能搜索**：支持关键词、标签、作者等多维度搜索
- **中英双语**：完美支持中文和英文搜索
- **多来源搜索**：可从 ClawHub、本地仓库等多个来源搜索技能
- **实时更新**：技能数据库保持最新状态
- **详细信息**：提供技能包的完整描述、使用示例和版本信息

## 使用场景

1. **寻找特定技能**：快速定位符合需求的技能包
2. **技能分类浏览**：按类别浏览可用技能
3. **技能趋势分析**：了解热门技能和最新发布
4. **技能依赖查询**：查看技能包之间的依赖关系

## 搜索语法

FindSkills 支持高级搜索语法：

- 关键词搜索：`"web scraping"`
- 标签搜索：`tag:automation`
- 作者搜索：`author:clawhub`
- 组合搜索：`"data analysis" tag:python`

## 安装与使用

安装后，您可以使用以下命令：

- 搜索技能：`findskill search <关键词>`
- 列出热门技能：`findskill trending`
- 查看技能详情：`findskill info <技能名称>`

## 技术栈

- Node.js
- TypeScript
- Axios（HTTP 请求）
- Fuse.js（模糊搜索）

## 贡献

欢迎在 GitHub 上提交 Issue 和 Pull Request！

## 许可证

MIT License
