#!/bin/bash
# WorkBuddy Skills 安装脚本 (macOS/Linux/Git Bash)
#
# 模式一：从已 clone 的本仓库目录安装
#   bash install.sh                              # 全量安装到用户级
#   bash install.sh global                       # 只装 global 分类
#   bash install.sh global coding                # 装 global + coding
#   bash install.sh --skill coding/github        # 只装单个技能
#   bash install.sh --project global coding      # 装到项目级 .workbuddy/skills/
#
# 模式二：从 GitHub 远程一键安装（自动 clone → 安装 → 清理）
#   bash install.sh --clone global coding        # 远程装 global+coding 到用户级
#   bash install.sh --clone --project global     # 远程装到项目级
#   bash install.sh --clone                      # 远程全量安装

REPO_URL="https://github.com/bitcjm/workbuddy-skills.git"
CATEGORIES="global office coding ai-creation"
COUNT=0
TARGET_DIR="$HOME/.workbuddy/skills"
INSTALL_MODE="categories"    # categories | skill
SKILL_PATH=""
PROJECT_MODE=false
CLONE_MODE=false
CLEANUP_CLONE=false
CLONE_DIR=""

# 解析参数
while [[ $# -gt 0 ]]; do
    case "$1" in
        --clone)
            CLONE_MODE=true
            shift
            ;;
        --project)
            PROJECT_MODE=true
            TARGET_DIR=".workbuddy/skills"
            shift
            ;;
        --skill)
            INSTALL_MODE="skill"
            shift
            SKILL_PATH="$1"
            shift
            ;;
        *)
            break
            ;;
    esac
done

SELECTED_CATEGORIES=("$@")

echo "======================================="
echo "  WorkBuddy Skills 安装脚本"
echo "======================================="
echo ""

# ── Clone 模式 ──
if [ "$CLONE_MODE" = true ]; then
    CLONE_DIR=$(mktemp -d workbuddy-skills-XXXXXX)
    echo "⬇️  正在从 GitHub 克隆仓库..."
    if ! git clone --depth 1 "$REPO_URL" "$CLONE_DIR" 2>&1; then
        echo "❌ 克隆失败，请检查网络连接"
        rm -rf "$CLONE_DIR"
        exit 1
    fi
    SKILLS_DIR="$CLONE_DIR"
    CLEANUP_CLONE=true
    echo "✅ 克隆完成: $CLONE_DIR"
    echo ""
else
    SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
fi

# ── 单个技能安装 ──
if [ "$INSTALL_MODE" = "skill" ]; then
    if [ -z "$SKILL_PATH" ]; then
        echo "❌ 请指定技能路径，格式: --skill <分类>/<技能名>"
        echo "   示例: --skill coding/github"
        [ "$CLEANUP_CLONE" = true ] && rm -rf "$CLONE_DIR"
        exit 1
    fi

    SKILL_FULL_PATH="$SKILLS_DIR/$SKILL_PATH"
    SKILL_NAME="$(basename "$SKILL_PATH")"
    TARGET="$TARGET_DIR/$SKILL_NAME"

    if [ ! -d "$SKILL_FULL_PATH" ]; then
        echo "❌ 技能不存在: $SKILL_PATH"
        [ "$CLEANUP_CLONE" = true ] && rm -rf "$CLONE_DIR"
        exit 1
    fi

    mkdir -p "$TARGET_DIR"
    mkdir -p "$TARGET"

    if [ -d "$TARGET" ] && [ "$(ls -A "$TARGET" 2>/dev/null)" ]; then
        echo "🔄 更新: $SKILL_PATH → $TARGET"
    else
        echo "📦 安装: $SKILL_PATH → $TARGET"
    fi

    cp -r "$SKILL_FULL_PATH/"* "$TARGET/" 2>/dev/null
    cp -r "$SKILL_FULL_PATH/".[!.]* "$TARGET/" 2>/dev/null
    ((COUNT++))

    # 清理 clone 目录
    if [ "$CLEANUP_CLONE" = true ]; then
        echo ""
        echo "🧹 清理临时克隆目录: $CLONE_DIR"
        rm -rf "$CLONE_DIR"
    fi

    echo ""
    echo "✅ 安装完成！共处理 $COUNT 个技能"
    exit 0
fi

# ── 分类安装 ──
mkdir -p "$TARGET_DIR"

if [ ${#SELECTED_CATEGORIES[@]} -eq 0 ]; then
    SELECTED_CATEGORIES=($CATEGORIES)
fi

for cat in "${SELECTED_CATEGORIES[@]}"; do
    CAT_PATH="$SKILLS_DIR/$cat"
    if [ ! -d "$CAT_PATH" ]; then
        echo "⚠️  分类不存在: $cat"
        continue
    fi

    echo "📁 [$cat]"
    for skill_dir in "$CAT_PATH"/*/; do
        [ -d "$skill_dir" ] || continue
        skill_name="$(basename "$skill_dir")"
        target="$TARGET_DIR/$skill_name"
        mkdir -p "$target"
        if [ "$(ls -A "$target" 2>/dev/null)" ]; then
            echo "  🔄 更新: $skill_name"
        else
            echo "  📦 安装: $skill_name"
        fi
        cp -r "$skill_dir"* "$target/" 2>/dev/null
        cp -r "$skill_dir".[!.]* "$target/" 2>/dev/null
        ((COUNT++))
    done
    echo ""
done

# 清理 clone 目录
if [ "$CLEANUP_CLONE" = true ]; then
    echo "🧹 清理临时克隆目录: $CLONE_DIR"
    rm -rf "$CLONE_DIR"
    echo ""
fi

echo "✅ 安装完成！共处理 $COUNT 个技能"
if [ "$PROJECT_MODE" = true ]; then
    echo "📍 安装位置: 项目级 (.workbuddy/skills/)"
else
    echo "📍 安装位置: 用户级 (~/.workbuddy/skills/)"
fi
