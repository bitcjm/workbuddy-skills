// 工具函数

/**
 * 带重试机制的函数执行
 * @param {Function} fn - 要执行的函数
 * @param {Object} options - 重试选项
 * @param {number} options.maxRetries - 最大重试次数
 * @param {number} options.retryDelay - 初始重试延迟（毫秒）
 * @param {number} options.retryMultiplier - 重试延迟乘数
 * @param {Array} options.retryableStatusCodes - 可重试的 HTTP 状态码
 * @returns {Promise<any>} - 函数执行结果
 */
export async function retry(fn, options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    retryMultiplier = 2,
    retryableStatusCodes = [429, 500, 502, 503, 504]
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = retryDelay * Math.pow(retryMultiplier, attempt - 1);
        console.log(`[Retry] 尝试 ${attempt}/${maxRetries}，等待 ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      
      // 检查是否应该重试
      const shouldRetry = attempt < maxRetries && (
        // 网络错误
        !error.response ||
        // 可重试的 HTTP 状态码
        retryableStatusCodes.includes(error.response.status)
      );
      
      if (!shouldRetry) {
        throw error;
      }
      
      console.log(`[Retry] 请求失败，准备重试: ${error.message}`);
    }
  }
  
  throw lastError;
}

/**
 * 生成随机延迟
 * @param {number} min - 最小延迟（毫秒）
 * @param {number} max - 最大延迟（毫秒）
 * @returns {number} - 随机延迟
 */
export function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 格式化时间
 * @param {Date} date - 日期对象
 * @returns {string} - 格式化后的时间字符串
 */
export function formatDate(date) {
  return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}
