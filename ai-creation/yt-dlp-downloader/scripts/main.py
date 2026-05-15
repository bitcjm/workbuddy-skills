import argparse
import os
import subprocess
import platform
import sys

def check_and_install_dependency(pkg_name, install_cmd):
    """
    检查依赖是否安装，未安装则自动安装
    :param pkg_name: 依赖名称（如 yt-dlp/ffmpeg）
    :param install_cmd: 安装命令列表（如 ["pip", "install", "yt-dlp"]）
    """
    try:
        # 检查依赖是否存在
        if pkg_name == "ffmpeg":
            # ffmpeg 用 -version
            subprocess.run([pkg_name, "-version"], check=True, capture_output=True, text=True)
        else:
            # 其他工具（如 yt-dlp）用 --version
            subprocess.run([pkg_name, "--version"], check=True, capture_output=True, text=True)
        print(f"✅ {pkg_name} 已安装")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print(f"❌ {pkg_name} 未安装，开始自动安装...")
        try:
            # 执行安装命令
            subprocess.run(
                install_cmd,
                capture_output=True,
                text=True,
                check=True
            )
            print(f"✅ {pkg_name} 安装成功")
            return True
        except subprocess.CalledProcessError as e:
            print(f"❌ {pkg_name} 安装失败：{e.stderr[:300]}")
            return False

def download_and_merge_video(url):
    """
    下载视频并合并音视频（自动处理依赖）
    """
    # 1. 系统判断（适配macOS/Linux/Windows）
    system = platform.system()
    save_dir = os.path.expanduser("~/Downloads/")
    os.makedirs(save_dir, exist_ok=True)
    video_title = "%(title)s"
    temp_output = f"{save_dir}/{video_title}.%(ext)s"
    final_output = f"{save_dir}/{video_title}.mp4"

    # 2. 自动安装依赖
    # 安装yt-dlp
    yt_dlp_ok = check_and_install_dependency(
        "yt-dlp",
        ["pip", "install", "yt-dlp", "--upgrade"]
    )
    if not yt_dlp_ok:
        return "❌ 核心依赖 yt-dlp 安装失败，无法继续"

    # 安装ffmpeg
    if system == "Darwin":  # macOS
        ffmpeg_ok = check_and_install_dependency("ffmpeg", ["brew", "install", "ffmpeg", "-q"])
    elif system == "Linux":  # Linux
        ffmpeg_ok = check_and_install_dependency("ffmpeg", ["apt", "install", "ffmpeg", "-y"])
    elif system == "Windows":  # Windows（需提前装choco）
        ffmpeg_ok = check_and_install_dependency("ffmpeg", ["choco", "install", "ffmpeg", "-y"])
    else:
        print("⚠️ 未知系统，需手动安装ffmpeg")
        ffmpeg_ok = False

    # 3. 下载视频（强制合并为mp4）
    if yt_dlp_ok:
        print("🚀 开始下载视频...")
        download_cmd = [
            "yt-dlp",
            url,
            "-o", temp_output,
            "--merge-output-format", "mp4",  # 强制合并
            "--no-playlist",
            "--progress",
            "--quiet"  # 减少输出，避免日志过长
        ]
        try:
            subprocess.run(
                download_cmd,
                capture_output=True,
                text=True,
                check=True,
                timeout=600  # 超时10分钟，适配大文件
            )
            print(f"✅ 视频下载完成，保存至：{save_dir}")
            return f"""✅ 视频下载&合并完成！
📁 保存路径：{save_dir}
💡 说明：已自动安装 yt-dlp/ffmpeg，视频已合并为MP4格式，可直接播放
"""
        except subprocess.TimeoutExpired:
            return "❌ 视频下载超时（超过10分钟），请检查网络或视频大小"
        except subprocess.CalledProcessError as e:
            return f"""❌ 视频下载/合并失败：{e.stderr[:500]}
💡 可能原因：
1. 视频链接无效：{url}
2. ffmpeg 安装失败（手动安装后重试）
3. 视频站点限制下载
"""
    return "❌ 依赖检查未通过，无法下载"

if __name__ == "__main__":
    # 解析命令行参数
    parser = argparse.ArgumentParser(description="自动安装依赖并下载合并视频")
    parser.add_argument("--url", required=True, help="视频链接")
    args = parser.parse_args()

    # 执行核心逻辑
    result = download_and_merge_video(args.url)
    # 输出结果（供OpenClaw读取）
    print(result)
    sys.exit(0)