#!/bin/bash
# WorkBuddy Skills 一键安装脚本 (macOS/Linux/Git Bash)
# 将所有分类目录下的 Skill 复制到 ~/.workbuddy/skills/

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$HOME/.workbuddy/skills"
CATEGORIES="global office stock coding ai-creation"
COUNT=0

echo "======================================="
echo "  WorkBuddy Skills 安装脚本"
echo "======================================="
echo ""

mkdir -p "$TARGET_DIR"

for cat in $CATEGORIES; do
    if [ ! -d "$SKILLS_DIR/$cat" ]; then
        continue
    fi
    for skill_dir in "$SKILLS_DIR/$cat"/*/; do
        [ -d "$skill_dir" ] || continue
        skill_name="$(basename "$skill_dir")"
        target="$TARGET_DIR/$skill_name"
        if [ -d "$target" ]; then
            echo "🔄 更新: [$cat] $skill_name"
        else
            echo "📦 安装: [$cat] $skill_name"
        fi
        cp -r "$skill_dir"* "$target/" 2>/dev/null
        ((COUNT++))
    done
done

echo ""
echo "✅ 安装完成！共处理 $COUNT 个技能"
