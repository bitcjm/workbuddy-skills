import BaseSource from './base-source.js';
import ClawHubAPI from '../clawhub-api.js';

class ClawHubSource extends BaseSource {
  constructor(options = {}) {
    super(options);
    this.name = 'clawhub';
    this.description = 'ClawHub 官方技能源';
    this.api = new ClawHubAPI(options.apiOptions || { baseURL: 'https://clawhub.ai' });
  }

  async searchSkills(query, options = {}) {
    try {
      const results = await this.api.searchSkills(query, options);
      return results.map(skill => this.formatSkill(skill));
    } catch (error) {
      console.error(`[ClawHubSource] 搜索错误:`, error);
      return [];
    }
  }

  async getSkillDetails(slug) {
    try {
      const skill = await this.api.getSkillDetails(slug);
      return this.formatSkill(skill);
    } catch (error) {
      console.error(`[ClawHubSource] 获取技能详情错误:`, error);
      return null;
    }
  }

  async getSkills(options = {}) {
    try {
      const results = await this.api.getSkills(options);
      return results.map(skill => this.formatSkill(skill));
    } catch (error) {
      console.error(`[ClawHubSource] 获取技能列表错误:`, error);
      return [];
    }
  }

  // 重写格式化方法
  formatSkill(skill) {
    const formatted = super.formatSkill(skill);
    return {
      ...formatted,
      source: 'clawhub',
      sourceUrl: `https://clawhub.ai/skills/${formatted.slug}`
    };
  }
}

export default ClawHubSource;