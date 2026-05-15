import SearchEngine from './search-engine.js';
import UIHelper from './ui-helper.js';
import ErrorHandler from './error-handler.js';

const searchEngine = new SearchEngine();

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    command: 'search',
    query: '',
    source: null,
    limit: 10,
    sort: 'relevance',
    help: false,
    filters: {
      minDownloads: 0,
      minQualityScore: 0,
      tags: [],
      verified: null
    }
  };

  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    switch (arg) {
      case 'search':
      case 'info':
      case 'related':
      case 'recommend':
      case 'popular':
      case 'sources':
        options.command = arg;
        break;
      case '--source':
      case '-s':
        options.source = args[i + 1];
        i++;
        break;
      case '--limit':
      case '-l':
        options.limit = parseInt(args[i + 1]);
        i++;
        break;
      case '--sort':
      case '-o':
        options.sort = args[i + 1];
        i++;
        break;
      case '--min-downloads':
      case '-d':
        options.filters.minDownloads = parseInt(args[i + 1]);
        i++;
        break;
      case '--min-quality':
      case '-q':
        options.filters.minQualityScore = parseInt(args[i + 1]);
        i++;
        break;
      case '--tags':
      case '-t':
        options.filters.tags = args[i + 1].split(',').map(tag => tag.trim());
        i++;
        break;
      case '--verified':
      case '-v':
        options.filters.verified = args[i + 1] === 'true';
        i++;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      default:
        if (!options.query) {
          options.query = arg;
        } else {
          options.query += ' ' + arg;
        }
    }
    i++;
  }

  return options;
}

async function main() {
  try {
    const options = parseArgs();

    if (options.help) {
      UIHelper.showHelp();
      return;
    }

    switch (options.command) {
      case 'search':
        if (!options.query) {
          UIHelper.showError('请提供搜索关键词');
          UIHelper.showHelp();
          return;
        }

        if (options.source) {
          // 从特定来源搜索
          const result = await searchEngine.searchFrom(options.source, options.query, {
            limit: options.limit,
            sort: options.sort,
            filters: options.filters
          });
          if (ErrorHandler.isSuccess(result)) {
            UIHelper.showTitle(`从 ${options.source} 搜索结果: "${options.query}"`);
            UIHelper.showSkillList(result.data.results, `从 ${options.source} 找到 ${result.data.total} 个结果`);
          } else {
            UIHelper.showError(result.error.message);
          }
        } else {
          // 多来源搜索
          const result = await searchEngine.search(options.query, {
            limit: options.limit,
            sort: options.sort,
            filters: options.filters
          });
          if (ErrorHandler.isSuccess(result)) {
            UIHelper.showTitle(`搜索结果: "${options.query}"`);
            UIHelper.showSearchResults(result.data, options.query);
          } else {
            UIHelper.showError(result.error.message);
          }
        }
        break;

      case 'info':
        if (!options.query) {
          UIHelper.showError('请提供技能名称');
          UIHelper.showHelp();
          return;
        }
        
        const skillDetailsResult = await searchEngine.getSkillDetails(options.query);
        if (ErrorHandler.isSuccess(skillDetailsResult)) {
          UIHelper.showTitle(`技能详情: ${skillDetailsResult.data.name}`);
          UIHelper.showSkillDetails(skillDetailsResult.data);
        } else {
          UIHelper.showError(skillDetailsResult.error.message);
        }
        break;

      case 'related':
        if (!options.query) {
          UIHelper.showError('请提供技能名称');
          UIHelper.showHelp();
          return;
        }
        
        const relatedResult = await searchEngine.getRelatedSkills(options.query, {
          limit: options.limit
        });
        if (ErrorHandler.isSuccess(relatedResult)) {
          UIHelper.showTitle(`相关技能推荐: ${relatedResult.data.targetSkill.name}`);
          UIHelper.showRecommendations(
            relatedResult.data.relatedSkills, 
            `为 "${relatedResult.data.targetSkill.name}" 推荐的相关技能`
          );
        } else {
          UIHelper.showError(relatedResult.error.message);
        }
        break;

      case 'recommend':
        if (!options.query) {
          UIHelper.showError('请提供兴趣关键词');
          UIHelper.showHelp();
          return;
        }
        
        const interests = options.query.split(',').map(interest => interest.trim());
        const recommendResult = await searchEngine.recommendForUser(interests, {
          limit: options.limit
        });
        if (ErrorHandler.isSuccess(recommendResult)) {
          UIHelper.showTitle('基于兴趣推荐');
          UIHelper.showRecommendations(
            recommendResult.data.recommendedSkills, 
            `基于兴趣 [${interests.join(', ')}] 的推荐`
          );
        } else {
          UIHelper.showError(recommendResult.error.message);
        }
        break;

      case 'popular':
        const popularResult = await searchEngine.getPopularSkills({
          limit: options.limit
        });
        if (ErrorHandler.isSuccess(popularResult)) {
          UIHelper.showTitle('热门技能推荐');
          UIHelper.showRecommendations(
            popularResult.data.popularSkills, 
            '热门技能推荐'
          );
        } else {
          UIHelper.showError(popularResult.error.message);
        }
        break;

      case 'sources':
        const sourcesResult = await searchEngine.checkSourcesAvailability();
        if (ErrorHandler.isSuccess(sourcesResult)) {
          UIHelper.showTitle('技能来源状态');
          UIHelper.showSourcesStatus(sourcesResult.data);
        } else {
          UIHelper.showError(sourcesResult.error.message);
        }
        break;

      default:
        UIHelper.showError('未知命令');
        UIHelper.showHelp();
    }

  } catch (error) {
    UIHelper.showError(ErrorHandler.getFriendlyErrorMessage(error));
  }
}

main();
