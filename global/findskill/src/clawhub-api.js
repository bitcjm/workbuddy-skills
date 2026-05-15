import axios from 'axios';
import { Skill } from './skill.js';
import cache from './cache.js';
import { retry } from './utils.js';

class ClawHubAPI {
  constructor(options = {}) {
    this.baseURL = options.baseURL || 'https://clawhub.ai';
    this.apiKey = options.apiKey || null;
    this.timeout = options.timeout || 10000;

    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: this.apiKey ? {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      } : {
        'Content-Type': 'application/json'
      }
    });
  }

  async searchSkills(query, options = {}) {
    const {
      limit = 10,
      minDownloads = 0,
      verified = null,
      qualityScore = 0,
      sort = 'downloads'
    } = options;

    // 生成缓存键
    const cacheKey = cache.generateKey('search', query, { limit, minDownloads, verified, qualityScore, sort });
    
    // 尝试从缓存获取结果
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('[ClawHubAPI] 从缓存获取搜索结果');
      return cachedResult;
    }

    try {
      // 直接使用镜像站 API，因为 ClawHub 源站 API 不存在或未公开
      console.log('[ClawHubAPI] 直接使用镜像站 API 搜索:', query);
      const results = await this._searchFromMirror(query, options);
      
      // 将结果存入缓存
      cache.set(cacheKey, results, 300000); // 缓存 5 分钟
      
      return results;
    } catch (error) {
      this._handleError(error, '搜索技能失败');
      return [];
    }
  }

  // 从镜像站搜索
  async _searchFromMirror(query, options = {}) {
    const limit = options.limit || 10;
    
    // 生成缓存键
    const cacheKey = cache.generateKey('mirror_search', query, { limit });
    
    // 尝试从缓存获取结果
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('[ClawHubAPI] 从缓存获取镜像站搜索结果');
      return cachedResult;
    }
    
    try {
      // 使用镜像站的 API 接口
      const mirrorUrl = 'https://skills.volces.com/api/v1/search';
      const params = {
        q: query,
        limit: limit
      };

      console.log(`[ClawHubAPI] 从镜像站搜索: ${query}`);
      
      // 使用重试机制
      const response = await retry(() => axios.get(mirrorUrl, { params }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });
      
      // 处理返回的数据
      const results = response.data.results || [];
      console.log(`[ClawHubAPI] 镜像站返回 ${results.length} 个结果`);

      // 转换为 Skill 对象
      const skills = results.map(item => {
        // 从 metaContent 中提取信息
        const metaContent = item.metaContent || {};
        const skillMd = metaContent.skillMd || '';
        
        // 解析 skillMd 中的信息
        const nameMatch = skillMd.match(/name: (.*)/);
        const descriptionMatch = skillMd.match(/description: (.*)/);
        
        return Skill.fromJSON({
          name: metaContent.displayName || item.displayName || nameMatch?.[1] || item.slug,
          slug: item.slug,
          description: metaContent.DisplayDescription || descriptionMatch?.[1] || item.summary || '暂无描述',
          tags: metaContent.Keywords || [],
          downloads: 0, // 镜像站 API 没有提供下载量
          verified: true, // 默认为已验证
          qualityScore: item.score || 0,
          repository: '', // 镜像站 API 没有提供仓库链接
          installCommand: '', // 镜像站 API 没有提供安装命令
          version: item.version || '1.0.0',
          author: metaContent.owner || '未知作者',
          createdAt: new Date(item.updatedAt || Date.now()).toISOString(),
          updatedAt: new Date(item.updatedAt || Date.now()).toISOString()
        });
      });
      
      // 将结果存入缓存
      cache.set(cacheKey, skills, 600000); // 缓存 10 分钟
      
      return skills;
    } catch (error) {
      console.error('[ClawHubAPI] 镜像站搜索失败:', error);
      return [];
    }
  }

  async getSkillDetails(slug) {
    // 生成缓存键
    const cacheKey = cache.generateKey('skill_details', slug);
    
    // 尝试从缓存获取结果
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('[ClawHubAPI] 从缓存获取技能详情');
      return cachedResult;
    }
    
    try {
      // 不使用 mock 数据
      const response = await retry(() => this.client.get(`/api/v1/skills/${slug}`), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });
      const skill = Skill.fromJSON(response.data);
      
      // 将结果存入缓存
      cache.set(cacheKey, skill, 3600000); // 缓存 1 小时
      
      return skill;
    } catch (error) {
      this._handleError(error, `获取技能详情失败: ${slug}`);
      return null;
    }
  }

  async getSkills(options = {}) {
    const {
      limit = 20,
      offset = 0,
      sort = 'downloads'
    } = options;

    // 生成缓存键
    const cacheKey = cache.generateKey('skills', { limit, offset, sort });
    
    // 尝试从缓存获取结果
    const cachedResult = cache.get(cacheKey);
    if (cachedResult) {
      console.log('[ClawHubAPI] 从缓存获取技能列表');
      return cachedResult;
    }

    try {
      // 不使用 mock 数据
      const params = {
        limit,
        offset,
        sort
      };

      const response = await retry(() => this.client.get('/api/v1/skills', { params }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });
      const skills = response.data.results.map(skill => Skill.fromJSON(skill));
      
      // 将结果存入缓存
      cache.set(cacheKey, skills, 1800000); // 缓存 30 分钟
      
      return skills;
    } catch (error) {
      this._handleError(error, '获取技能列表失败');
      return [];
    }
  }



  _handleError(error, message) {
    if (error.response) {
      throw new Error(`${message}: ${error.response.status} - ${error.response.data?.message || '未知错误'}`);
    } else if (error.request) {
      throw new Error(`${message}: 网络连接失败`);
    } else {
      throw new Error(`${message}: ${error.message}`);
    }
  }
}

export default ClawHubAPI;
