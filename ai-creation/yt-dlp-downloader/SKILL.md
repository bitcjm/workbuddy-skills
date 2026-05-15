---
name: yt-dlp-downloader
version: 1.0.0
description: 下载并合并网络视频（支持B站/抖音/YouTube），当用户说“下载视频+链接”时触发
tags: [yt-dlp, 视频下载, B站, 抖音, YouTube, ffmpeg]
license: MIT
author: Your Name
---

# 执行规则（严格按顺序执行，禁止额外操作）
1. 调用 exec 工具执行：python scripts/main.py --url {用户提供的视频链接}
2. 仅返回 main.py 的执行结果，不额外补充任何内容
3. 禁止执行规则外的任何命令（如 ls/brew list 等）
4. 单次会话仅执行1次该命令，避免频繁调用触发限流

# 入参要求
- 必须获取用户提供的完整视频链接（URL），无链接则提示用户补充

# 异常处理
如果执行失败，仅返回 main.py 输出的错误信息，不额外尝试修复