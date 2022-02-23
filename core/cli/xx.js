#!/usr/bin/env node

const commander = require("commander");
const pkg = require("./package.json");

const program = new commander.Command();

program
  .name("yj-cli")
  .description("创建一个项目")
  .usage("options]")
  .version(pkg.version)
  .option("-d,--debug", "开启调试模式", false);

program
  .command("create")
  .usage("<options>")
  .action(() => {
    //
  });

program.parse(process.argv);
