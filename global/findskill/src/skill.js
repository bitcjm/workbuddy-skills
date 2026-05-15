export class Skill {
  constructor(data = {}) {
    this.name = data.name || '';
    this.slug = data.slug || '';
    this.description = data.description || '';
    this.tags = data.tags || [];
    this.downloads = data.downloads || 0;
    this.verified = data.verified || false;
    this.qualityScore = data.qualityScore || 0;
    this.repository = data.repository || '';
    this.installCommand = data.installCommand || '';
    this.version = data.version || '1.0.0';
    this.author = data.author || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      slug: this.slug,
      description: this.description,
      tags: this.tags,
      downloads: this.downloads,
      verified: this.verified,
      qualityScore: this.qualityScore,
      repository: this.repository,
      installCommand: this.installCommand,
      version: this.version,
      author: this.author,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  static fromJSON(json) {
    // 处理技能详情 API 返回的结构
    if (json.skill) {
      return new Skill({
        name: json.skill.displayName,
        slug: json.skill.slug,
        description: json.skill.summary || '',
        tags: Object.keys(json.skill.tags || {}),
        downloads: json.skill.stats?.downloads || 0,
        verified: !json.moderation?.isSuspicious,
        qualityScore: 75, // 默认质量分数
        repository: '',
        installCommand: `clawhub install ${json.skill.slug}`,
        version: json.latestVersion?.version || '1.0.0',
        author: json.owner?.displayName || '',
        createdAt: json.skill.createdAt || new Date().toISOString(),
        updatedAt: json.skill.updatedAt || new Date().toISOString()
      });
    }
    
    // 处理搜索 API 返回的结构
    if (json.displayName && json.score) {
      return new Skill({
        name: json.displayName,
        slug: json.slug,
        description: json.summary || '',
        tags: [],
        downloads: 0,
        verified: false,
        qualityScore: Math.max(0, Math.min(100, Math.round((4 - json.score) * 25))), // 转换分数范围到 0-100
        repository: '',
        installCommand: `clawhub install ${json.slug}`,
        version: json.version || '1.0.0',
        author: '',
        createdAt: json.createdAt || new Date().toISOString(),
        updatedAt: json.updatedAt || new Date().toISOString()
      });
    }
    
    // 处理技能列表 API 返回的结构
    if (json.displayName) {
      return new Skill({
        name: json.displayName,
        slug: json.slug,
        description: json.summary || '',
        tags: Object.keys(json.tags || {}),
        downloads: json.stats?.downloads || 0,
        verified: true,
        qualityScore: 75, // 默认质量分数
        repository: '',
        installCommand: `clawhub install ${json.slug}`,
        version: json.latestVersion?.version || '1.0.0',
        author: '',
        createdAt: json.createdAt || new Date().toISOString(),
        updatedAt: json.updatedAt || new Date().toISOString()
      });
    }
    
    // 处理默认结构
    return new Skill(json);
  }

  getQualityLabel() {
    if (this.qualityScore >= 90) return '优秀';
    if (this.qualityScore >= 70) return '良好';
    if (this.qualityScore >= 50) return '一般';
    return '较差';
  }

  isPopular() {
    return this.downloads > 1000;
  }
}
