class BaseSource {
  constructor(options = {}) {
    this.options = options;
    this.name = 'base';
    this.description = '基础技能来源';
  }

  // 搜索技能（需要子类实现）
  async searchSkills(query, options = {}) {
    throw new Error('子类必须实现 searchSkills 方法');
  }

  // 获取技能详情（需要子类实现）
  async getSkillDetails(slug) {
    throw new Error('子类必须实现 getSkillDetails 方法');
  }

  // 获取技能列表（可选，需要子类实现）
  async getSkills(options = {}) {
    throw new Error('子类必须实现 getSkills 方法');
  }

  // 验证来源是否可用
  async isAvailable() {
    try {
      // 简单的可用性检查
      await this.getSkills({ limit: 1 });
      return true;
    } catch (error) {
      return false;
    }
  }

  // 格式化技能数据（子类可以覆盖）
  formatSkill(skill) {
    return {
      name: skill.name || '',
      slug: skill.slug || skill.name?.toLowerCase().replace(/\s+/g, '-') || '',
      description: skill.description || '',
      tags: skill.tags || [],
      downloads: skill.downloads || 0,
      verified: skill.verified || false,
      qualityScore: skill.qualityScore || 0,
      author: skill.author || '',
      version: skill.version || '1.0.0',
      installCommand: skill.installCommand || `clawhub install ${skill.slug}`,
      repository: skill.repository || '',
      source: this.name
    };
  }
}

export default BaseSource;