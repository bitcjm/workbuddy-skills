class UIHelper {
  // 显示加载状态
  static showLoading(message = '加载中...') {
    console.log(`🔄 ${message}`);
  }

  // 显示成功消息
  static showSuccess(message) {
    console.log(`✅ ${message}`);
  }

  // 显示错误消息
  static showError(message) {
    console.log(`❌ ${message}`);
  }

  // 显示警告消息
  static showWarning(message) {
    console.log(`⚠️ ${message}`);
  }

  // 显示信息消息
  static showInfo(message) {
    console.log(`ℹ️ ${message}`);
  }

  // 显示分隔线
  static showSeparator() {
    console.log('========================================');
  }

  // 显示标题
  static showTitle(title) {
    this.showSeparator();
    console.log(`📌 ${title}`);
    this.showSeparator();
  }

  // 显示技能列表
  static showSkillList(skills, title = '技能列表') {
    this.showTitle(title);
    if (skills.length === 0) {
      this.showInfo('没有找到相关技能');
      return;
    }
    
    skills.forEach((skill, index) => {
      console.log(`\n${index + 1}. ${skill.name}`);
      console.log(`   来源: ${skill.source}`);
      console.log(`   描述: ${skill.description}`);
      console.log(`   标签: ${skill.tags?.join(', ') || '无'}`);
      console.log(`   下载量: ${skill.downloads || 0}`);
      console.log(`   质量评分: ${skill.qualityScore || 0}`);
      console.log(`   已验证: ${skill.verified ? '是' : '否'}`);
      if (skill.installCommand) {
        console.log(`   安装命令: ${skill.installCommand}`);
      }
      if (skill.sourceUrl) {
        console.log(`   来源链接: ${skill.sourceUrl}`);
      }
    });
    
    this.showSeparator();
    this.showInfo(`共找到 ${skills.length} 个技能`);
  }

  // 显示技能详情
  static showSkillDetails(skill) {
    this.showTitle(`技能详情: ${skill.name}`);
    console.log(`来源: ${skill.source}`);
    console.log(`描述: ${skill.description}`);
    console.log(`标签: ${skill.tags?.join(', ') || '无'}`);
    console.log(`下载量: ${skill.downloads || 0}`);
    console.log(`质量评分: ${skill.qualityScore || 0}`);
    console.log(`已验证: ${skill.verified ? '是' : '否'}`);
    console.log(`作者: ${skill.author || '未知'}`);
    console.log(`版本: ${skill.version || '1.0.0'}`);
    if (skill.installCommand) {
      console.log(`安装命令: ${skill.installCommand}`);
    }
    if (skill.repository) {
      console.log(`仓库: ${skill.repository}`);
    }
    if (skill.sourceUrl) {
      console.log(`来源链接: ${skill.sourceUrl}`);
    }
    this.showSeparator();
  }

  // 显示搜索结果
  static showSearchResults(results, query) {
    this.showTitle(`搜索结果: "${query}"`);
    this.showInfo(`语言: ${results.language === 'zh' ? '中文' : '英文'}`);
    if (results.translatedQuery && results.translatedQuery !== query) {
      this.showInfo(`翻译后: "${results.translatedQuery}"`);
    }
    this.showSkillList(results.results, `找到 ${results.total} 个结果`);
  }

  // 显示推荐结果
  static showRecommendations(recommendations, title) {
    this.showTitle(title);
    if (recommendations.length === 0) {
      this.showInfo('没有找到推荐技能');
      return;
    }
    
    recommendations.forEach((item, index) => {
      console.log(`\n${index + 1}. ${item.name}`);
      console.log(`   来源: ${item.source}`);
      console.log(`   描述: ${item.description}`);
      if (item.similarityScore) {
        console.log(`   相似度: ${(item.similarityScore * 100).toFixed(1)}%`);
      }
      if (item.relevanceScore) {
        console.log(`   相关度: ${(item.relevanceScore * 100).toFixed(1)}%`);
      }
      console.log(`   下载量: ${item.downloads || 0}`);
    });
    
    this.showSeparator();
    this.showInfo(`共推荐 ${recommendations.length} 个技能`);
  }

  // 显示来源状态
  static showSourcesStatus(sources) {
    this.showTitle('技能来源状态');
    sources.forEach(source => {
      const status = source.available ? '✅ 可用' : '❌ 不可用';
      console.log(`${source.name}: ${status}`);
      console.log(`   描述: ${source.description}`);
    });
    this.showSeparator();
  }

  // 显示分页信息
  static showPaginationInfo(pagination) {
    console.log(`📄 第 ${pagination.page}/${pagination.totalPages} 页，共 ${pagination.total} 条记录`);
  }

  // 显示命令帮助
  static showHelp() {
    this.showTitle('FindSkills 命令帮助');
    console.log('可用命令:');
    console.log('  search <关键词> - 搜索技能');
    console.log('  search-from <来源> <关键词> - 从特定来源搜索');
    console.log('  info <技能名称> - 获取技能详情');
    console.log('  related <技能名称> - 获取相关技能推荐');
    console.log('  recommend <兴趣1> <兴趣2>... - 基于兴趣推荐技能');
    console.log('  popular - 查看热门技能');
    console.log('  sources - 查看技能来源状态');
    console.log('  help - 显示帮助信息');
    this.showSeparator();
    console.log('可用选项:');
    console.log('  --source, -s <来源> - 指定技能来源');
    console.log('  --limit, -l <数量> - 限制结果数量');
    console.log('  --sort, -o <排序> - 排序方式 (relevance, downloads, quality, name)');
    console.log('  --min-downloads, -d <数量> - 最小下载量');
    console.log('  --min-quality, -q <分数> - 最小质量评分');
    console.log('  --tags, -t <标签1,标签2> - 按标签过滤');
    console.log('  --verified, -v <true|false> - 只显示已验证的技能');
    console.log('  --help, -h - 显示帮助信息');
    this.showSeparator();
  }
}

export default UIHelper;