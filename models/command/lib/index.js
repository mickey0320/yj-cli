"use strict";
const log = require("@yj-cli/log");

class Command {
  constructor(argv) {
    if (!argv) {
      throw new Error("Command参数不能为空");
    }
    if (!Array.isArray(argv)) {
      throw new Error("Command参数必须是数组");
    }
    if (argv.length < 1) {
      throw new Error("参数列表不能为空");
    }
    this._argv = argv;
    const runner = new Promise((resolve) => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());

      chain.catch((msg) => {
        log.error(msg);
      });
    });
  }
  init() {
    throw new Error("init必须实现");
  }
  exec() {
    throw new Error("exec必须实现");
  }
  initArgs() {
    this._cmd = this._argv[this._argv.length - 1];
    this._argv = this._argv.slice(0, this._argv.length - 1);
  }
}

module.exports = Command;
