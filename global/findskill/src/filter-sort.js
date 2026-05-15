class FilterSort {
  // 过滤技能
  static filterSkills(skills, filters = {}) {
    return skills.filter(skill => {
      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        const skillTags = (skill.tags || []).map(tag => tag.toLowerCase());
        const hasAllTags = filters.tags.every(tag => 
          skillTags.includes(tag.toLowerCase())
        );
        if (!hasAllTags) return false;
      }

      // 下载量过滤
      if (filters.minDownloads && skill.downloads < filters.minDownloads) {
        return false;
      }

      // 质量评分过滤
      if (filters.qualityScore && skill.qualityScore < filters.qualityScore) {
        return false;
      }

      // 验证状态过滤
      if (filters.verified !== undefined && skill.verified !== filters.verified) {
        return false;
      }

      // 来源过滤
      if (filters.sources && filters.sources.length > 0) {
        if (!filters.sources.includes(skill.source)) {
          return false;
        }
      }

      // 作者过滤
      if (filters.author) {
        if (!skill.author || !skill.author.toLowerCase().includes(filters.author.toLowerCase())) {
          return false;
        }
      }

      // 版本过滤
      if (filters.minVersion) {
        if (!skill.version || this.compareVersions(skill.version, filters.minVersion) < 0) {
          return false;
        }
      }

      return true;
    });
  }

  // 排序技能
  static sortSkills(skills, sortBy = 'relevance', sortOrder = 'desc') {
    return skills.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'downloads':
          comparison = (b.downloads || 0) - (a.downloads || 0);
          break;
        case 'quality':
          comparison = (b.qualityScore || 0) - (a.qualityScore || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'source':
          // 优先显示 ClawHub 官方来源
          if (a.source === 'clawhub' && b.source !== 'clawhub') comparison = -1;
          else if (a.source !== 'clawhub' && b.source === 'clawhub') comparison = 1;
          else comparison = a.source.localeCompare(b.source);
          break;
        case 'relevance':
        default:
          // 基于质量评分和下载量的综合排序
          const scoreA = (a.qualityScore || 0) * 0.7 + (a.downloads || 0) / 1000 * 0.3;
          const scoreB = (b.qualityScore || 0) * 0.7 + (b.downloads || 0) / 1000 * 0.3;
          comparison = scoreB - scoreA;
          break;
      }

      // 处理排序顺序
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  // 分页技能
  static paginateSkills(skills, page = 1, pageSize = 20) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      items: skills.slice(startIndex, endIndex),
      total: skills.length,
      page,
      pageSize,
      totalPages: Math.ceil(skills.length / pageSize)
    };
  }

  // 版本比较
  static compareVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  // 高级搜索（组合过滤和排序）
  static advancedSearch(skills, criteria = {}) {
    // 应用过滤
    let filteredSkills = this.filterSkills(skills, criteria.filters || {});

    // 应用排序
    filteredSkills = this.sortSkills(
      filteredSkills,
      criteria.sortBy || 'relevance',
      criteria.sortOrder || 'desc'
    );

    // 应用分页
    if (criteria.pagination) {
      return this.paginateSkills(
        filteredSkills,
        criteria.pagination.page || 1,
        criteria.pagination.pageSize || 20
      );
    }

    return filteredSkills;
  }
}

export default FilterSort;