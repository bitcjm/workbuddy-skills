# WorkBuddy Skills 安装脚本 (Windows PowerShell)
#
# 模式一：从已 clone 的本仓库目录安装
#   .\install.ps1                                # 全量安装到用户级
#   .\install.ps1 global                         # 只装 global 分类
#   .\install.ps1 global coding                  # 装 global + coding
#   .\install.ps1 -Skill coding/github           # 只装单个技能
#   .\install.ps1 -Project global coding         # 装到项目级 .workbuddy/skills/
#
# 模式二：从 GitHub 远程一键安装（自动 clone → 安装 → 清理）
#   .\install.ps1 -Clone global coding           # 远程装 global+coding 到用户级
#   .\install.ps1 -Clone -Project global         # 远程装到项目级
#   .\install.ps1 -Clone                         # 远程全量安装

$Clone = $false
$Project = $false
$Skill = ""
$Categories = @()

# 手动解析参数（兼容 PowerShell 5.1）
$i = 0
while ($i -lt $args.Count) {
    switch ($args[$i]) {
        "-Clone"    { $Clone = $true; $i++ }
        "-Project"  { $Project = $true; $i++ }
        "-Skill"    { $i++; $Skill = $args[$i]; $i++ }
        default     { $Categories += $args[$i]; $i++ }
    }
}

$RepoUrl = "https://github.com/bitcjm/workbuddy-skills.git"
$AllCategories = @("global", "office", "coding", "ai-creation")
$Count = 0
$CleanupClone = $false
$CloneDir = ""

if ($Project) {
    $TargetDir = ".workbuddy\skills"
} else {
    $TargetDir = "$env:USERPROFILE\.workbuddy\skills"
}

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  WorkBuddy Skills Install (Windows)" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# -- Clone --
if ($Clone) {
    $CloneDir = Join-Path $env:TEMP "workbuddy-skills-$(Get-Random)"
    Write-Host "[Clone] Downloading from GitHub..." -ForegroundColor Cyan
    git clone --depth 1 $RepoUrl $CloneDir 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Clone failed. Check network connection." -ForegroundColor Red
        if (Test-Path $CloneDir) { Remove-Item -Recurse -Force $CloneDir }
        exit 1
    }
    $ScriptDir = $CloneDir
    $CleanupClone = $true
    Write-Host "[OK] Cloned to: $CloneDir" -ForegroundColor Green
    Write-Host ""
} else {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
}

# -- Single Skill --
if ($Skill) {
    $SkillFullPath = Join-Path $ScriptDir $Skill
    $SkillName = Split-Path $Skill -Leaf
    $Target = Join-Path $TargetDir $SkillName

    if (-not (Test-Path $SkillFullPath)) {
        Write-Host "[ERROR] Skill not found: $Skill" -ForegroundColor Red
        if ($CleanupClone -and (Test-Path $CloneDir)) { Remove-Item -Recurse -Force $CloneDir }
        exit 1
    }

    if (-not (Test-Path $TargetDir)) {
        New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    }
    if (-not (Test-Path $Target)) {
        New-Item -ItemType Directory -Path $Target -Force | Out-Null
    }

    $hasContent = Get-ChildItem -Path $Target -ErrorAction SilentlyContinue
    if ($hasContent) {
        Write-Host "  [Update] $Skill" -ForegroundColor Gray
    } else {
        Write-Host "  [Install] $Skill" -ForegroundColor Green
    }

    Copy-Item -Path "$SkillFullPath\*" -Destination $Target -Recurse -Force
    $Count++

    if ($CleanupClone -and (Test-Path $CloneDir)) {
        Write-Host ""
        Write-Host "[Cleanup] Removing temp clone: $CloneDir" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $CloneDir
    }

    Write-Host ""
    Write-Host "[Done] $Count skill(s) installed" -ForegroundColor Green
    exit 0
}

# -- Category Install --
if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "[Dir] Created: $TargetDir" -ForegroundColor Yellow
}

if ($Categories.Count -eq 0) {
    $Categories = $AllCategories
}

foreach ($Cat in $Categories) {
    $CatPath = Join-Path $ScriptDir $Cat
    if (-not (Test-Path $CatPath)) {
        Write-Host "[WARN] Category not found: $Cat" -ForegroundColor Yellow
        continue
    }

    Write-Host "[$Cat]" -ForegroundColor Cyan
    $Skills = Get-ChildItem -Path $CatPath -Directory
    foreach ($SkillItem in $Skills) {
        $Target = Join-Path $TargetDir $SkillItem.Name
        if (-not (Test-Path $Target)) {
            New-Item -ItemType Directory -Path $Target -Force | Out-Null
        }
        $hasContent = Get-ChildItem -Path $Target -ErrorAction SilentlyContinue
        if ($hasContent) {
            Write-Host "  [Update] $($SkillItem.Name)" -ForegroundColor Gray
        } else {
            Write-Host "  [Install] $($SkillItem.Name)" -ForegroundColor Green
        }
        Copy-Item -Path "$($SkillItem.FullName)\*" -Destination $Target -Recurse -Force
        $Count++
    }
    Write-Host ""
}

if ($CleanupClone -and (Test-Path $CloneDir)) {
    Write-Host "[Cleanup] Removing temp clone: $CloneDir" -ForegroundColor Yellow
    Remove-Item -Recurse -Force $CloneDir
    Write-Host ""
}

Write-Host "[Done] $Count skill(s) installed" -ForegroundColor Green
if ($Project) {
    Write-Host "[Location] Project-level (.workbuddy\skills\)" -ForegroundColor Cyan
} else {
    Write-Host "[Location] User-level (~\.workbuddy\skills\)" -ForegroundColor Cyan
}
