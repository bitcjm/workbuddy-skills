import ClawHubSource from './clawhub-source.js';
import GitHubSource from './github-source.js';
import FilterSort from '../filter-sort.js';

class SourceManager {
  constructor(options = {}) {
    this.options = options;
    this.sources = [];
    this.initSources();
  }

  // 初始化所有来源
  initSources() {
    // 添加 ClawHub 来源
    this.sources.push(new ClawHubSource({
      apiOptions: this.options.clawhubOptions || { baseURL: 'https://clawhub.ai' }
    }));

    // 添加 GitHub 来源
    this.sources.push(new GitHubSource({
      token: this.options.githubToken
    }));

    // 可以在此添加更多来源
  }

  // 获取所有可用来源
  getSources() {
    return this.sources;
  }

  // 搜索所有来源
  async searchAll(query, options = {}) {
    try {
      // 使用 Promise.allSettled 替代 Promise.all，确保即使某个数据源失败，也能继续使用其他数据源
      const results = await Promise.allSettled(
        this.sources.map(async (source) => {
          try {
            const sourceResults = await source.searchSkills(query, options);
            console.log(`[SourceManager] 从 ${source.name} 搜索到 ${sourceResults.length} 个结果`);
            return sourceResults;
          } catch (error) {
            console.error(`[SourceManager] 从 ${source.name} 搜索失败:`, error.message);
            return [];
          }
        })
      );

      // 合并结果并去重
      const mergedResults = this.mergeAndDeduplicate(
        results.map(result => result.value || []).flat()
      );
      
      // 应用过滤
      let filteredResults = mergedResults;
      if (options.filters) {
        filteredResults = FilterSort.filterSkills(mergedResults, options.filters);
      }
      
      // 应用排序
      const sortedResults = FilterSort.sortSkills(
        filteredResults,
        options.sort || 'relevance',
        options.sortOrder || 'desc'
      );
      
      // 应用分页
      if (options.pagination) {
        return FilterSort.paginateSkills(
          sortedResults,
          options.pagination.page || 1,
          options.pagination.pageSize || 20
        );
      }
      
      return sortedResults;
    } catch (error) {
      console.error('[SourceManager] 搜索错误:', error);
      return [];
    }
  }

  // 从特定来源搜索
  async searchFrom(sourceName, query, options = {}) {
    try {
      const source = this.sources.find(s => s.name === sourceName);
      if (!source) {
        throw new Error(`来源 ${sourceName} 不存在`);
      }
      
      // 检查来源是否可用
      const isAvailable = await source.isAvailable();
      if (!isAvailable) {
        console.warn(`[SourceManager] 来源 ${sourceName} 不可用，尝试从其他来源搜索`);
        // 如果指定来源不可用，尝试从所有来源搜索
        return this.searchAll(query, options);
      }
      
      let results = await source.searchSkills(query, options);
      
      // 应用过滤
      if (options.filters) {
        results = FilterSort.filterSkills(results, options.filters);
      }
      
      // 应用排序
      results = FilterSort.sortSkills(
        results,
        options.sort || 'relevance',
        options.sortOrder || 'desc'
      );
      
      // 应用分页
      if (options.pagination) {
        return FilterSort.paginateSkills(
          results,
          options.pagination.page || 1,
          options.pagination.pageSize || 20
        );
      }
      
      return results;
    } catch (error) {
      console.error(`[SourceManager] 从 ${sourceName} 搜索错误:`, error);
      // 如果从特定来源搜索失败，尝试从所有来源搜索
      console.warn(`[SourceManager] 从 ${sourceName} 搜索失败，尝试从其他来源搜索`);
      return this.searchAll(query, options);
    }
  }

  // 获取技能详情（从所有来源）
  async getSkillDetails(slug) {
    try {
      let lastError = null;
      
      for (const source of this.sources) {
        try {
          // 检查来源是否可用
          const isAvailable = await source.isAvailable();
          if (!isAvailable) {
            console.warn(`[SourceManager] 来源 ${source.name} 不可用，跳过`);
            continue;
          }
          
          const skill = await source.getSkillDetails(slug);
          if (skill) {
            console.log(`[SourceManager] 从 ${source.name} 获取技能详情成功`);
            return skill;
          }
        } catch (error) {
          console.error(`[SourceManager] 从 ${source.name} 获取技能详情失败:`, error.message);
          lastError = error;
          // 继续尝试下一个来源
        }
      }
      
      if (lastError) {
        console.error('[SourceManager] 从所有来源获取技能详情失败');
      }
      return null;
    } catch (error) {
      console.error('[SourceManager] 获取技能详情错误:', error);
      return null;
    }
  }

  // 合并结果并去重
  mergeAndDeduplicate(results) {
    const seen = new Set();
    return results.filter(skill => {
      const key = `${skill.slug}-${skill.source}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  // 检查所有来源的可用性
  async checkSourcesAvailability() {
    const availability = [];
    for (const source of this.sources) {
      const isAvailable = await source.isAvailable();
      availability.push({
        name: source.name,
        description: source.description,
        available: isAvailable
      });
    }
    return availability;
  }

  // 高级搜索
  async advancedSearch(criteria = {}) {
    try {
      // 使用 Promise.allSettled 替代 Promise.all，确保即使某个数据源失败，也能继续使用其他数据源
      const results = await Promise.allSettled(
        this.sources.map(async (source) => {
          try {
            // 检查来源是否可用
            const isAvailable = await source.isAvailable();
            if (!isAvailable) {
              console.warn(`[SourceManager] 来源 ${source.name} 不可用，跳过`);
              return [];
            }
            
            const sourceResults = await source.searchSkills(criteria.query || '', criteria);
            console.log(`[SourceManager] 从 ${source.name} 高级搜索到 ${sourceResults.length} 个结果`);
            return sourceResults;
          } catch (error) {
            console.error(`[SourceManager] 从 ${source.name} 高级搜索失败:`, error.message);
            return [];
          }
        })
      );

      // 合并结果并去重
      const mergedResults = this.mergeAndDeduplicate(
        results.map(result => result.value || []).flat()
      );
      
      // 应用高级搜索
      return FilterSort.advancedSearch(mergedResults, criteria);
    } catch (error) {
      console.error('[SourceManager] 高级搜索错误:', error);
      return [];
    }
  }
}

export default SourceManager;