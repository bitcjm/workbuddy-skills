import BaseSource from './base-source.js';
import axios from 'axios';
import { Skill } from '../skill.js';
import { retry } from '../utils.js';

class GitHubSource extends BaseSource {
  constructor(options = {}) {
    super(options);
    this.name = 'github';
    this.description = 'GitHub 技能来源';
    this.apiUrl = 'https://api.github.com';
    this.client = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      },
      timeout: 10000
    });
  }

  // 搜索技能
  async searchSkills(query, options = {}) {
    const {
      limit = 10,
      page = 1
    } = options;

    try {
      // 搜索包含 SKILL.md 的仓库，并且仓库名称或描述包含查询关键词
      const response = await retry(() => this.client.get('/search/repositories', {
        params: {
          q: `${query} in:name,description SKILL.md`,
          per_page: limit,
          page: page
        }
      }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });

      const repositories = response.data.items;
      const skills = await Promise.all(
        repositories.map(async (repo) => {
          try {
            // 尝试获取仓库中的 SKILL.md 文件内容
            const skillMdResponse = await retry(() => this.client.get(`/repos/${repo.owner.login}/${repo.name}/contents/SKILL.md`), {
              maxRetries: 3,
              retryDelay: 1000,
              retryMultiplier: 2,
              retryableStatusCodes: [429, 500, 502, 503, 504]
            });
            const skillMdContent = Buffer.from(skillMdResponse.data.content, 'base64').toString('utf8');
            
            // 解析 SKILL.md 文件内容，提取技能信息
            const skill = this._parseSkillMd(skillMdContent, repo);
            return this.formatSkill(skill);
          } catch (error) {
            // 如果获取 SKILL.md 文件失败，使用仓库信息创建一个基本的技能对象
            return this.formatSkill({
              name: repo.name,
              description: repo.description,
              author: repo.owner.login,
              repository: repo.html_url,
              downloads: repo.stargazers_count // 使用星标数作为下载量的近似值
            });
          }
        })
      );

      return skills;
    } catch (error) {
      console.error('[GitHubSource] 搜索技能失败:', error.message);
      return [];
    }
  }

  // 获取技能详情
  async getSkillDetails(slug) {
    try {
      // 搜索特定的仓库
      const response = await retry(() => this.client.get('/search/repositories', {
        params: {
          q: `${slug} in:name SKILL.md`,
          per_page: 1
        }
      }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });

      if (response.data.items.length === 0) {
        return null;
      }

      const repo = response.data.items[0];
      
      try {
        // 尝试获取仓库中的 SKILL.md 文件内容
        const skillMdResponse = await retry(() => this.client.get(`/repos/${repo.owner.login}/${repo.name}/contents/SKILL.md`), {
          maxRetries: 3,
          retryDelay: 1000,
          retryMultiplier: 2,
          retryableStatusCodes: [429, 500, 502, 503, 504]
        });
        const skillMdContent = Buffer.from(skillMdResponse.data.content, 'base64').toString('utf8');
        
        // 解析 SKILL.md 文件内容，提取技能信息
        const skill = this._parseSkillMd(skillMdContent, repo);
        return this.formatSkill(skill);
      } catch (error) {
        // 如果获取 SKILL.md 文件失败，使用仓库信息创建一个基本的技能对象
        return this.formatSkill({
          name: repo.name,
          description: repo.description,
          author: repo.owner.login,
          repository: repo.html_url,
          downloads: repo.stargazers_count // 使用星标数作为下载量的近似值
        });
      }
    } catch (error) {
      console.error('[GitHubSource] 获取技能详情失败:', error.message);
      return null;
    }
  }

  // 获取技能列表
  async getSkills(options = {}) {
    const {
      limit = 10,
      page = 1
    } = options;

    try {
      // 搜索包含 SKILL.md 的仓库
      const response = await retry(() => this.client.get('/search/repositories', {
        params: {
          q: 'SKILL.md',
          per_page: limit,
          page: page,
          sort: 'stars',
          order: 'desc'
        }
      }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });

      const repositories = response.data.items;
      const skills = await Promise.all(
        repositories.map(async (repo) => {
          try {
            // 尝试获取仓库中的 SKILL.md 文件内容
            const skillMdResponse = await retry(() => this.client.get(`/repos/${repo.owner.login}/${repo.name}/contents/SKILL.md`), {
              maxRetries: 3,
              retryDelay: 1000,
              retryMultiplier: 2,
              retryableStatusCodes: [429, 500, 502, 503, 504]
            });
            const skillMdContent = Buffer.from(skillMdResponse.data.content, 'base64').toString('utf8');
            
            // 解析 SKILL.md 文件内容，提取技能信息
            const skill = this._parseSkillMd(skillMdContent, repo);
            return this.formatSkill(skill);
          } catch (error) {
            // 如果获取 SKILL.md 文件失败，使用仓库信息创建一个基本的技能对象
            return this.formatSkill({
              name: repo.name,
              description: repo.description,
              author: repo.owner.login,
              repository: repo.html_url,
              downloads: repo.stargazers_count // 使用星标数作为下载量的近似值
            });
          }
        })
      );

      return skills;
    } catch (error) {
      console.error('[GitHubSource] 获取技能列表失败:', error.message);
      return [];
    }
  }

  // 验证来源是否可用
  async isAvailable() {
    try {
      // 简单的可用性检查，尝试获取一个包含 SKILL.md 的仓库
      await retry(() => this.client.get('/search/repositories', {
        params: {
          q: 'SKILL.md',
          per_page: 1
        }
      }), {
        maxRetries: 3,
        retryDelay: 1000,
        retryMultiplier: 2,
        retryableStatusCodes: [429, 500, 502, 503, 504]
      });
      return true;
    } catch (error) {
      console.error('[GitHubSource] 来源不可用:', error.message);
      return false;
    }
  }

  // 解析 SKILL.md 文件内容
  _parseSkillMd(content, repo) {
    // 简单的解析逻辑，提取技能信息
    const skill = {
      name: repo.name,
      description: repo.description,
      author: repo.owner.login,
      repository: repo.html_url,
      downloads: repo.stargazers_count
    };

    // 尝试从 SKILL.md 内容中提取更多信息
    const lines = content.split('\n');
    let inFrontMatter = false;
    
    for (const line of lines) {
      if (line === '---') {
        inFrontMatter = !inFrontMatter;
        continue;
      }

      if (inFrontMatter) {
        const match = line.match(/^\s*(\w+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          if (key === 'name') {
            skill.name = value.replace(/"/g, '').trim();
          } else if (key === 'description') {
            skill.description = value.replace(/"/g, '').trim();
          } else if (key === 'version') {
            skill.version = value.replace(/"/g, '').trim();
          }
        }
      }
    }

    return skill;
  }
}

export default GitHubSource;
