import SourceManager from './sources/source-manager.js';
import I18N from './i18n.js';
import Recommender from './recommender.js';
import ErrorHandler from './error-handler.js';

class SearchEngine {
  constructor(options = {}) {
    this.sourceManager = new SourceManager(options.sourceOptions || {});
    this.options = {
      defaultLimit: 20,
      defaultSort: 'relevance',
      ...options
    };
  }

  // 主搜索方法
  async search(query, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 合并选项
      const mergedOptions = {
        ...this.options,
        ...options
      };

      // 检测语言并翻译查询
      const lang = I18N.detectLanguage(query);
      const translatedQuery = I18N.translateQuery(query);

      console.log(`[SearchEngine] 检测到语言: ${lang}, 原始查询: ${query}, 翻译后: ${translatedQuery}`);

      // 从所有来源搜索
      const results = await this.sourceManager.searchAll(translatedQuery, {
        limit: mergedOptions.defaultLimit,
        sort: mergedOptions.defaultSort,
        ...options
      });

      // 优化结果排序（考虑语言因素）
      const optimizedResults = this.optimizeResults(results, query, lang);

      return {
        query,
        translatedQuery,
        language: lang,
        results: optimizedResults,
        total: optimizedResults.length
      };
    }, '搜索失败');
  }

  // 从特定来源搜索
  async searchFrom(sourceName, query, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 检测语言并翻译查询
      const lang = I18N.detectLanguage(query);
      const translatedQuery = I18N.translateQuery(query);

      // 从指定来源搜索
      const results = await this.sourceManager.searchFrom(sourceName, translatedQuery, options);

      // 优化结果排序
      const optimizedResults = this.optimizeResults(results, query, lang);

      return {
        query,
        translatedQuery,
        language: lang,
        source: sourceName,
        results: optimizedResults,
        total: optimizedResults.length
      };
    }, `从 ${sourceName} 搜索失败`);
  }

  // 优化搜索结果
  optimizeResults(results, originalQuery, language) {
    if (language === 'zh') {
      // 对于中文查询，增加包含中文字符的结果的权重
      return results.map(skill => {
        let score = skill.qualityScore || 0;
        
        // 检查技能名称和描述是否包含中文字符
        if (skill.name && /[\u4e00-\u9fa5]/.test(skill.name)) {
          score += 0.5;
        }
        if (skill.description && /[\u4e00-\u9fa5]/.test(skill.description)) {
          score += 0.3;
        }
        
        return {
          ...skill,
          relevanceScore: score
        };
      }).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }
    
    return results;
  }

  // 获取技能详情
  async getSkillDetails(slug) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      const skill = await this.sourceManager.getSkillDetails(slug);
      if (!skill) {
        throw new Error(`技能 ${slug} 未找到`);
      }
      return skill;
    }, '获取技能详情失败');
  }

  // 批量搜索（支持多个查询）
  async batchSearch(queries, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      const results = await Promise.all(
        queries.map(query => this.search(query, options))
      );
      
      return results;
    }, '批量搜索失败');
  }

  // 高级搜索（支持复杂过滤）
  async advancedSearch(criteria, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 构建查询字符串
      let query = criteria.query || '';
      
      // 处理标签过滤
      if (criteria.tags && criteria.tags.length > 0) {
        criteria.tags.forEach(tag => {
          query += ` tag:${tag}`;
        });
      }
      
      // 处理作者过滤
      if (criteria.author) {
        query += ` author:${criteria.author}`;
      }
      
      // 调用主搜索方法
      return await this.search(query, {
        ...options,
        minDownloads: criteria.minDownloads,
        verified: criteria.verified,
        qualityScore: criteria.qualityScore
      });
    }, '高级搜索失败');
  }

  // 获取相关技能推荐
  async getRelatedSkills(slug, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 获取目标技能
      const targetSkillResult = await this.getSkillDetails(slug);
      if (!ErrorHandler.isSuccess(targetSkillResult)) {
        throw new Error(targetSkillResult.error.message);
      }
      const targetSkill = targetSkillResult.data;

      // 获取所有技能
      const allSkillsResult = await this.search('', {
        limit: 100 // 获取足够多的技能用于推荐
      });
      if (!ErrorHandler.isSuccess(allSkillsResult)) {
        throw new Error(allSkillsResult.error.message);
      }
      const allSkills = allSkillsResult.data.results;

      // 获取相关技能
      const relatedSkills = Recommender.getRelatedSkills(targetSkill, allSkills, options);

      return {
        targetSkill,
        relatedSkills,
        total: relatedSkills.length
      };
    }, '获取相关技能推荐失败');
  }

  // 基于用户兴趣推荐技能
  async recommendForUser(interests, options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 获取所有技能
      const allSkillsResult = await this.search('', {
        limit: 200 // 获取足够多的技能用于推荐
      });
      if (!ErrorHandler.isSuccess(allSkillsResult)) {
        throw new Error(allSkillsResult.error.message);
      }
      const allSkills = allSkillsResult.data.results;

      // 基于兴趣推荐
      const recommendedSkills = Recommender.recommendForUser(interests, allSkills, options);

      return {
        interests,
        recommendedSkills,
        total: recommendedSkills.length
      };
    }, '基于兴趣推荐技能失败');
  }

  // 获取热门技能
  async getPopularSkills(options = {}) {
    return ErrorHandler.wrapAsyncOperation(async () => {
      // 获取所有技能
      const allSkillsResult = await this.search('', {
        limit: 200 // 获取足够多的技能用于推荐
      });
      if (!ErrorHandler.isSuccess(allSkillsResult)) {
        throw new Error(allSkillsResult.error.message);
      }
      const allSkills = allSkillsResult.data.results;

      // 获取热门技能
      const popularSkills = Recommender.getPopularSkills(allSkills, options);

      return {
        popularSkills,
        total: popularSkills.length
      };
    }, '获取热门技能失败');
  }

  // 获取所有来源
  getSources() {
    return this.sourceManager.getSources();
  }

  // 检查来源可用性
  async checkSourcesAvailability() {
    return ErrorHandler.wrapAsyncOperation(async () => {
      return await this.sourceManager.checkSourcesAvailability();
    }, '检查来源可用性失败');
  }
}

export default SearchEngine;