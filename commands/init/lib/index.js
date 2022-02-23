"use strict";

const { Command } = require("@yj-cli/command");
const log = require("@yj-cli/log");

class InitCommand extends Command {
  init() {
    this.projectName = this._argv[0] || "";
    this.force = this._cmd.force;
    log.verbose("projectName", this.projectName);
    log.verbose("force", this.force);
    //
  }
  exec() {
    //
  }
}

function init(argv) {
  return new InitCommand(argv);
}

module.exports = init;
exports.InitCommand = InitCommand;
