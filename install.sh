#!/bin/bash
# WorkBuddy Skills 安装脚本 (macOS/Linux/Git Bash)
# 用法:
#   bash install.sh                              # 全量安装
#   bash install.sh global                       # 只装 global 分类
#   bash install.sh global coding                # 装 global + coding
#   bash install.sh --skill coding/github        # 只装单个技能
#   bash install.sh --project global coding      # 装到项目级 .workbuddy/skills/
#   bash install.sh --project --skill office/周报生成  # 单个技能装到项目级

SKILLS_DIR="$(cd "$(dirname "$0")" && pwd)"
CATEGORIES="global office coding ai-creation"
COUNT=0
TARGET_DIR="$HOME/.workbuddy/skills"
INSTALL_MODE="categories"    # categories | skill
SKILL_PATH=""
PROJECT_MODE=false

# 解析参数
while [[ $# -gt 0 ]]; do
    case "$1" in
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
            # 未知参数视为分类名
            break
            ;;
    esac
done

# 剩余参数作为分类列表
SELECTED_CATEGORIES=("$@")

echo "======================================="
echo "  WorkBuddy Skills 安装脚本"
echo "======================================="
echo ""

# 单个技能安装模式
if [ "$INSTALL_MODE" = "skill" ]; then
    if [ -z "$SKILL_PATH" ]; then
        echo "❌ 请指定技能路径，格式: --skill <分类>/<技能名>"
        echo "   示例: --skill coding/github"
        exit 1
    fi

    SKILL_FULL_PATH="$SKILLS_DIR/$SKILL_PATH"
    SKILL_NAME="$(basename "$SKILL_PATH")"
    TARGET="$TARGET_DIR/$SKILL_NAME"

    if [ ! -d "$SKILL_FULL_PATH" ]; then
        echo "❌ 技能不存在: $SKILL_FULL_PATH"
        exit 1
    fi

    mkdir -p "$TARGET_DIR"

    if [ -d "$TARGET" ]; then
        echo "🔄 更新: $SKILL_PATH → $TARGET"
    else
        echo "📦 安装: $SKILL_PATH → $TARGET"
    fi

    cp -r "$SKILL_FULL_PATH/"* "$TARGET/" 2>/dev/null
    cp -r "$SKILL_FULL_PATH/".[!.]* "$TARGET/" 2>/dev/null
    ((COUNT++))

    echo ""
    echo "✅ 安装完成！共处理 $COUNT 个技能"
    exit 0
fi

# 分类安装模式
mkdir -p "$TARGET_DIR"

# 如果未指定分类，则全量安装
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
        if [ -d "$target" ]; then
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

echo "✅ 安装完成！共处理 $COUNT 个技能"
if [ "$PROJECT_MODE" = true ]; then
    echo "📍 安装位置: 项目级 (.workbuddy/skills/)"
else
    echo "📍 安装位置: 用户级 (~/.workbuddy/skills/)"
fi
