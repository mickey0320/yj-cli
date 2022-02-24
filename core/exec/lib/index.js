"use strict";
const path = require("path");
const cp = require("child_process");

const Package = require("@yj-cli/package");
const log = require("@yj-cli/log");

const settings = {
  //   init: "@yj-cli/init",
  init: "@imooc-cli/init",
};
const cacheDir = "dependencies";

function exec(...args) {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  let storeDir = "";
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);

  const cmdObj = args[args.length - 1];
  const name = cmdObj.name();
  const packageName = settings[name];
  const packageVersion = "1.1.0";
  let pkg;

  if (!targetPath) {
    targetPath = path.resolve(homePath, cacheDir);
    storeDir = path.join(targetPath, "node_modules");
    pkg = new Package({
      targetPath,
      storeDir,
      packageName,
      packageVersion,
    });
    if (pkg.exist()) {
      pkg.update();
    } else {
      pkg.install();
    }
  } else {
    pkg = new Package({
      targetPath,
      packageName,
      packageVersion,
    });
  }
  const rootFilePath = pkg.getRootFilePath();
  const cmd = args[args.length - 1];
  const o = Object.create(null);
  Object.keys(cmd).forEach((key) => {
    if (cmd.hasOwnProperty(key) && !key.startsWith("_") && key !== "parent") {
      o[key] = cmd[key];
    }
  });
  args[args.length - 1] = o;
  const code = `require('${rootFilePath}').call(null,${JSON.stringify(args)})`;
  const child = cp.spawn("node", ["-e", code], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  child.on("error", (e) => {
    log.error(e.message);
  });
  child.on("exit", (e) => {
    log.verbose("命令执行成功" + e);
  });
}

module.exports = exec;
