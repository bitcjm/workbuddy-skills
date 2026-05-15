# WorkBuddy Skills 一键安装脚本 (Windows PowerShell)
# 将所有分类目录下的 Skill 复制到 ~/.workbuddy/skills/

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$TargetDir = "$env:USERPROFILE\.workbuddy\skills"
$Categories = @("global", "office", "stock", "coding", "ai-creation")
$Count = 0

Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  WorkBuddy Skills 安装脚本 (Windows)" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $TargetDir)) {
    New-Item -ItemType Directory -Path $TargetDir -Force | Out-Null
    Write-Host "📁 创建目标目录: $TargetDir" -ForegroundColor Yellow
}

foreach ($Cat in $Categories) {
    $CatPath = Join-Path $ScriptDir $Cat
    if (-not (Test-Path $CatPath)) { continue }
    
    $Skills = Get-ChildItem -Path $CatPath -Directory
    foreach ($Skill in $Skills) {
        $Target = Join-Path $TargetDir $Skill.Name
        if (Test-Path $Target) {
            Write-Host "🔄 更新: [$Cat] $($Skill.Name)" -ForegroundColor Gray
        } else {
            Write-Host "📦 安装: [$Cat] $($Skill.Name)" -ForegroundColor Green
        }
        Copy-Item -Path "$($Skill.FullName)\*" -Destination $Target -Recurse -Force
        $Count++
    }
}

Write-Host ""
Write-Host "✅ 安装完成！共处理 $Count 个技能" -ForegroundColor Green
