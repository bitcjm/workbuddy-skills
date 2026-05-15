# WorkBuddy Skills 安装脚本 (Windows PowerShell)
# 用法:
#   .\install.ps1                                # 全量安装
#   .\install.ps1 global                         # 只装 global 分类
#   .\install.ps1 global coding                  # 装 global + coding
#   .\install.ps1 -Skill coding/github           # 只装单个技能
#   .\install.ps1 -Project global coding         # 装到项目级 .workbuddy/skills/
#   .\install.ps1 -Project -Skill office/周报生成  # 单个技能装到项目级

param(
    [switch]$Project,
    [string]$Skill,
    [Parameter(ValueFromRemainingArguments)]
    [string[]]$Categories
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$AllCategories = @("global", "office", "coding", "ai-creation")
$Count = 0

if ($Project) {
    $TargetDir = ".workbuddy\skills"
} else {
    $TargetDir = "$env:USERPROFILE\.workbuddy\skills"
}

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  WorkBuddy Skills 安装脚本 (Windows)" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# 单个技能安装模式
if ($Skill) {
    $SkillFullPath = Join-Path $ScriptDir $Skill
    $SkillName = Split-Path $Skill -Leaf
    $Target = Join-Path $TargetDir $SkillName

    if (-not (Test-Path $SkillFullPath)) {
        Write-Host "❌ 技能不存在: $SkillFullPath" -ForegroundColor Red
        exit 1
    }

    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }

    if (Test-Path $Target) {
        Write-Host "🔄 更新: $Skill → $Target" -ForegroundColor Gray
    } else {
        Write-Host "📦 安装: $Skill → $Target" -ForegroundColor Green
    }

    Copy-Item -Path "$SkillFullPath\*" -Destination $Target -Recurse -Force
    $Count++

    Write-Host ""
    Write-Host "✅ 安装完成！共处理 $Count 个技能" -ForegroundColor Green
    exit 0
}

# 分类安装模式
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "📁 创建目标目录: $TargetDir" -ForegroundColor Yellow
}

# 如果未指定分类，则全量安装
if ($Categories.Count -eq 0) {
    $Categories = $AllCategories
}

foreach ($Cat in $Categories) {
    $CatPath = Join-Path $ScriptDir $Cat
    if (-not (Test-Path $CatPath)) {
        Write-Host "⚠️  分类不存在: $Cat" -ForegroundColor Yellow
        continue
    }

    Write-Host "📁 [$Cat]" -ForegroundColor Cyan
    $Skills = Get-ChildItem -Path $CatPath -Directory
    foreach ($SkillItem in $Skills) {
        $Target = Join-Path $TargetDir $SkillItem.Name
        if (Test-Path $Target) {
            Write-Host "  🔄 更新: $($SkillItem.Name)" -ForegroundColor Gray
        } else {
            Write-Host "  📦 安装: $($SkillItem.Name)" -ForegroundColor Green
        }
        Copy-Item -Path "$($SkillItem.FullName)\*" -Destination $Target -Recurse -Force
        $Count++
    }
    Write-Host ""
}

Write-Host "✅ 安装完成！共处理 $Count 个技能" -ForegroundColor Green
if ($Project) {
    Write-Host "📍 安装位置: 项目级 (.workbuddy\skills\)" -ForegroundColor Cyan
} else {
    Write-Host "📍 安装位置: 用户级 (~\.workbuddy\skills\)" -ForegroundColor Cyan
}
