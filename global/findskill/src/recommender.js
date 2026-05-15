class Recommender {
  // 计算技能之间的相似度
  static calculateSimilarity(skill1, skill2) {
    let similarity = 0;
    let totalWeight = 0;

    // 标签相似度（权重 0.5）
    if (skill1.tags && skill2.tags) {
      const commonTags = skill1.tags.filter(tag => skill2.tags.includes(tag));
      const tagSimilarity = commonTags.length / Math.max(skill1.tags.length, skill2.tags.length);
      similarity += tagSimilarity * 0.5;
      totalWeight += 0.5;
    }

    // 描述相似度（权重 0.3）
    if (skill1.description && skill2.description) {
      const descSimilarity = this.calculateTextSimilarity(
        skill1.description,
        skill2.description
      );
      similarity += descSimilarity * 0.3;
      totalWeight += 0.3;
    }

    // 名称相似度（权重 0.2）
    if (skill1.name && skill2.name) {
      const nameSimilarity = this.calculateTextSimilarity(
        skill1.name,
        skill2.name
      );
      similarity += nameSimilarity * 0.2;
      totalWeight += 0.2;
    }

    // 归一化相似度
    return totalWeight > 0 ? similarity / totalWeight : 0;
  }

  // 计算文本相似度（简单的词频匹配）
  static calculateTextSimilarity(text1, text2) {
    const words1 = this.extractWords(text1.toLowerCase());
    const words2 = this.extractWords(text2.toLowerCase());

    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = new Set([...words1, ...words2]).size;

    return totalWords > 0 ? commonWords.length / totalWords : 0;
  }

  // 提取文本中的单词
  static extractWords(text) {
    return text
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 1);
  }

  // 获取相关技能推荐
  static getRelatedSkills(targetSkill, allSkills, options = {}) {
    const {
      limit = 5,
      minSimilarity = 0.1,
      excludeSameSource = false
    } = options;

    // 计算与目标技能的相似度
    const skillsWithSimilarity = allSkills
      .filter(skill => {
        // 排除自身
        if (skill.slug === targetSkill.slug) return false;
        
        // 可选：排除同一来源
        if (excludeSameSource && skill.source === targetSkill.source) return false;
        
        return true;
      })
      .map(skill => ({
        skill,
        similarity: this.calculateSimilarity(targetSkill, skill)
      }))
      .filter(item => item.similarity >= minSimilarity)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    return skillsWithSimilarity.map(item => ({
      ...item.skill,
      similarityScore: item.similarity
    }));
  }

  // 基于用户兴趣推荐技能
  static recommendForUser(userInterests, allSkills, options = {}) {
    const {
      limit = 10,
      minRelevance = 0.1
    } = options;

    // 计算每个技能与用户兴趣的相关性
    const skillsWithRelevance = allSkills
      .map(skill => {
        let relevance = 0;
        
        // 检查技能标签与用户兴趣的匹配
        if (skill.tags) {
          const matchingTags = skill.tags.filter(tag => 
            userInterests.some(interest => 
              tag.toLowerCase().includes(interest.toLowerCase())
            )
          );
          relevance += matchingTags.length / Math.max(skill.tags.length, 1) * 0.6;
        }

        // 检查技能描述与用户兴趣的匹配
        if (skill.description) {
          userInterests.forEach(interest => {
            if (skill.description.toLowerCase().includes(interest.toLowerCase())) {
              relevance += 0.2;
            }
          });
        }

        // 检查技能名称与用户兴趣的匹配
        if (skill.name) {
          userInterests.forEach(interest => {
            if (skill.name.toLowerCase().includes(interest.toLowerCase())) {
              relevance += 0.2;
            }
          });
        }

        return {
          skill,
          relevance
        };
      })
      .filter(item => item.relevance >= minRelevance)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);

    return skillsWithRelevance.map(item => ({
      ...item.skill,
      relevanceScore: item.relevance
    }));
  }

  // 获取热门技能推荐
  static getPopularSkills(skills, options = {}) {
    const {
      limit = 10,
      minDownloads = 100
    } = options;

    return skills
      .filter(skill => skill.downloads >= minDownloads)
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, limit);
  }

  // 获取最新技能推荐
  static getRecentSkills(skills, options = {}) {
    const {
      limit = 10,
      daysSinceUpdate = 30
    } = options;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceUpdate);

    return skills
      .filter(skill => {
        if (!skill.updatedAt) return false;
        const updateDate = new Date(skill.updatedAt);
        return updateDate >= cutoffDate;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  }
}

export default Recommender;