const fs = require("fs-extra");
const path = require("path");

module.exports = async function (name, options) {
  // 执行创建命令

  // 当前命令行选择的目录
  const cwd = process.cwd();
  console.log(cwd);
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name);
  console.log(targetAir);

  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {
    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // TODO：询问用户是否确定要覆盖
    }
  }
};
