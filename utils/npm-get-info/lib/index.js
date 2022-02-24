"use strict";
const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org"
    : "https://registry.npm.taobao.org";
}

function getNpmInfo(npmName, registry) {
  if (!npmName) return null;
  registry = registry || getDefaultRegistry();
  const url = urlJoin(registry, npmName);
  return axios
    .get(url)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

async function getNpmVersions(npmName, registry) {
  const npmInfo = await getNpmInfo(npmName, registry);
  if (npmInfo) {
    return Object.keys(npmInfo.versions);
  } else {
    return [];
  }
}

function getSemverVersions(baseVersion, versions) {
  return versions.filter((version) =>
    semver.satisfies(version, `^${baseVersion}`)
  );
}

async function getNpmSemverVersion(baseVersion, npmName, register) {
  const versions = await getNpmVersions(npmName, register);
  const semverVersions = getSemverVersions(baseVersion, versions);
  if (semverVersions && semverVersions.length > 0) {
    return semverVersions[0];
  }
  return null;
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVersions,
  getNpmSemverVersion,
};
