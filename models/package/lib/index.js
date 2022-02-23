"use strict";
const path = require("path");
const pkgDir = require("pkg-dir").sync;
const npminstall = require("npminstall");
const pathExists = require("path-exists").sync;
const fse = require("fs-extra");

const { isObject } = require("@yj-cli/utils");

class Package {
  constructor(options) {
    if (!options) {
      throw new Error("参数不能为空");
    }
    if (!isObject(options)) {
      throw new Error("参数必须是对象");
    }
    this.targetPath = options.targetPath;
    this.storeDir = options.storeDir;
    this.packageName = options.packageName;
    this.packageVersion = options.packageVersion;
    this.npmCacheFilePathPrefix = this.packageName.replace("/", "_");
  }
  prepare() {
    if (this.storeDir && !pathExists(this.storeDir)) {
      fse.mkdirpSync(this.storeDir);
    }
    if (this.packageVersion === "latest") {
      this.packageVersion = "";
    }
  }
  exist() {
    if (this.storeDir) {
      this.prepare();
      return pathExists(this.cacheFilePath);
    } else {
      return pathExists(this.targetPath);
    }
  }
  async update() {
    this.prepare();
    const latestVersion = "1.1.2";
    const latestCacheFilePath = this.getLatestCacheFilePath(latestVersion);
    if (!pathExists(latestCacheFilePath)) {
      await npminstall({
        root: this.targetPath,
        storeDir: "",
        registry: "https://registry.npmjs.org",
        pkgs: [
          {
            name: this.packageName,
            version: latestVersion,
          },
        ],
      });
      this.packageVersion = latestVersion;
    }
  }
  get cacheFilePath() {
    return path.resolve(
      this.storeDir,
      `_${this.npmCacheFilePathPrefix}@${this.packageVersion}@${this.packageName}`
    );
  }
  getLatestCacheFilePath(latestPackageVersion) {
    return path.resolve(
      this.storeDir,
      `_${this.npmCacheFilePathPrefix}@${latestPackageVersion}@${this.packageName}`
    );
  }
  install() {
    this.prepare();
    return npminstall({
      root: this.targetPath,
      storeDir: "",
      registry: "https://registry.npmjs.org",
      pkgs: [
        {
          name: this.packageName,
          version: this.packageVersion,
        },
      ],
    });
  }
  getRootFilePath() {
    function _get(targetPath) {
      const dir = pkgDir(targetPath);
      if (dir) {
        const pkgFile = require(path.resolve(dir, "package.json"));
        if (pkgFile && pkgFile.main) {
          return path.resolve(dir, pkgFile.main);
        }
      }
      return null;
    }
    if (this.storeDir) {
      return _get(this.cacheFilePath);
    } else {
      return _get(this.targetPath);
    }
  }
}

module.exports = Package;
