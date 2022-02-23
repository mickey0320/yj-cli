const path = require("path");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const minimist = require("minimist");
const dotenv = require("dotenv");
const pathExists = require("path-exists").sync;
const commander = require("commander");
const log = require("@yj-cli/log");
const { getNpmInfo } = require("@yj-cli/npm-get-info");
const exec = require("@yj-cli/exec");
const { LOWEST_NODE_VERSION, CLI_HOME } = require("./const");
const pkg = require("../package.json");

module.exports = cli;

function cli() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    // checkInputArgs();
    checkEnv();
    checkUpdate();
    registerCommand();
  } catch (err) {
    log.error(err.message);
    if (process.env.LOG_LEVEL === "verbose") {
      console.log(err);
    }
  }
}

function checkPkgVersion() {
  log.notice("cli", pkg.version);
}

function checkNodeVersion() {
  const currentVersion = process.version;
  if (!semver.gte(currentVersion, LOWEST_NODE_VERSION)) {
    throw new Error(
      colors.red(`yj-cli需要安装最低的node版本是${LOWEST_NODE_VERSION}`)
    );
  }
}

function checkRoot() {
  require("root-check")();
}

function checkUserHome() {
  if (!userHome) {
    throw new Error(colors.red("用户主目录不存在"));
  }
}

function checkInputArgs() {
  const args = minimist(process.argv.slice(2));
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

function checkEnv() {
  const dotenvPath = path.join(userHome, ".env");
  if (pathExists(dotenvPath)) {
    dotenv.config({
      path: dotenvPath,
    });
  }
  if (process.env.CLI_HOME) {
    process.env.CLI_HOME_PATH = path.join(userHome, process.env.CLI_HOME);
  } else {
    process.env.CLI_HOME_PATH = path.join(userHome, CLI_HOME);
  }
}

async function checkUpdate() {
  getNpmInfo(pkg.name);
}

function registerCommand() {
  const program = new commander.Command();
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("command [options]")
    .version(pkg.version)
    .option("-d,--debug", "开始调试模式", false)
    .option("-tp,--targetPath <targetPath>", "指定本地调试文件路径", "");

  program
    .command("init [projectName]")
    .option("-f,--force", "是否强制初始化项目", false)
    .action(exec);

  program.on("option:debug", () => {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
  });
  program.on("command:*", (otherCommands) => {
    const availableCommands = program.commands.map((cmd) => cmd.name());
    if (availableCommands.length > 0) {
      console.log(colors.red(`可用的命令:${availableCommands.join(",")}`));
    }
    console.log(colors.red(`不可用的命令:${otherCommands[0]}`));
  });
  program.on("option:targetPath", () => {
    process.env.CLI_TARGET_PATH = program.opts().targetPath;
  });

  program.parse(process.argv);

  //   if (program.args?.length < 1) {
  //     program.outputHelp();
  //     console.log();
  //   }
}
