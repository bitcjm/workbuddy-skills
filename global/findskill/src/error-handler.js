class ErrorHandler {
  // 处理网络错误
  static handleNetworkError(error) {
    console.error('网络错误:', error.message);
    return {
      success: false,
      error: {
        type: 'network',
        message: '网络连接失败，请检查您的网络连接后重试',
        details: error.message
      }
    };
  }

  // 处理API错误
  static handleApiError(error) {
    console.error('API错误:', error.message);
    return {
      success: false,
      error: {
        type: 'api',
        message: 'API请求失败，请稍后重试',
        details: error.message
      }
    };
  }

  // 处理参数错误
  static handleParameterError(error) {
    console.error('参数错误:', error.message);
    return {
      success: false,
      error: {
        type: 'parameter',
        message: '参数错误，请检查输入参数',
        details: error.message
      }
    };
  }

  // 处理未找到错误
  static handleNotFoundError(resource, identifier) {
    console.error(`${resource} 未找到:`, identifier);
    return {
      success: false,
      error: {
        type: 'not_found',
        message: `${resource} 未找到`,
        details: `${resource} "${identifier}" 不存在`
      }
    };
  }

  // 处理通用错误
  static handleGeneralError(error) {
    console.error('通用错误:', error.message);
    return {
      success: false,
      error: {
        type: 'general',
        message: '发生未知错误，请稍后重试',
        details: error.message
      }
    };
  }

  // 处理并格式化错误
  static handleError(error) {
    if (error.message.includes('Network') || error.message.includes('network')) {
      return this.handleNetworkError(error);
    } else if (error.message.includes('API') || error.message.includes('api')) {
      return this.handleApiError(error);
    } else if (error.message.includes('parameter') || error.message.includes('参数')) {
      return this.handleParameterError(error);
    } else if (error.message.includes('not found') || error.message.includes('未找到')) {
      return this.handleNotFoundError('技能', error.message.split('"')[1] || '未知');
    } else {
      return this.handleGeneralError(error);
    }
  }

  // 生成友好的错误消息
  static getFriendlyErrorMessage(error) {
    const handledError = this.handleError(error);
    return handledError.error.message;
  }

  // 检查响应是否成功
  static isSuccess(response) {
    return response && response.success !== false;
  }

  // 包装异步操作，提供错误处理
  static async wrapAsyncOperation(operation, errorMessage = '操作失败') {
    try {
      const result = await operation();
      return {
        success: true,
        data: result
      };
    } catch (error) {
      console.error(errorMessage, error);
      return this.handleError(error);
    }
  }
}

export default ErrorHandler;