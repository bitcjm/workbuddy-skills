class Cache {
  constructor(options = {}) {
    this.options = {
      defaultTtl: 3600000, // 默认缓存时间：1小时
      maxSize: 1000, // 最大缓存条目数
      ...options
    };
    this.cache = new Map();
  }

  // 生成缓存键
  generateKey(prefix, ...args) {
    const key = `${prefix}:${JSON.stringify(args)}`;
    return key;
  }

  // 获取缓存
  get(key) {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    // 检查缓存是否过期
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  // 设置缓存
  set(key, value, ttl = this.options.defaultTtl) {
    // 检查缓存大小，如果超过最大值，删除最旧的条目
    if (this.cache.size >= this.options.maxSize) {
      this._evictOldest();
    }

    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  // 删除缓存
  delete(key) {
    return this.cache.delete(key);
  }

  // 清除所有缓存
  clear() {
    this.cache.clear();
  }

  // 获取缓存大小
  size() {
    return this.cache.size;
  }

  // 检查缓存是否存在
  has(key) {
    return this.get(key) !== null;
  }

  // 驱逐最旧的缓存条目
  _evictOldest() {
    let oldestKey = null;
    let oldestExpiresAt = Infinity;

    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt < oldestExpiresAt) {
        oldestExpiresAt = item.expiresAt;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // 清理过期缓存
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// 导出单例缓存实例
const cache = new Cache();
export default cache;
