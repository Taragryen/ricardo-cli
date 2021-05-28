const { getRepoList, getTagList } = require("./http");
const ora = require("ora");
const inquirer = require("inquirer");

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result;
  } catch (error) {
    console.log(error);
    // 状态为修改为失败
    spinner.fail("Request failed, refetch ...");
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, "waiting fetch template");
    if (!repoList) return;

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name);

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: "repo",
      type: "list",
      choices: repos,
      message: "Please choose a template to create project",
    });

    // 3）return 用户选择的名称
    return repo;
  }

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, "waiting fetch tag", repo);
    if (!tags) return;

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item) => item.name);

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: "tag",
      type: "list",
      choices: tagsList,
      message: "Place choose a tag to create project",
    });

    // 3）return 用户选择的 tag
    return tag;
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();

    // 2) 获取 tag 名称
    const tag = await this.getTag(repo);

    console.log("用户选择了，repo=" + repo + "，tag=" + tag);
  }
}

module.exports = Generator;