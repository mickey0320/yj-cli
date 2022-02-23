"use strict";
const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

function getNpmInfo(npmName) {
  //   console.log("name:" + npmName);
  //   const url = urlJoin("https://registry.npmjs.org", npmName);
  //   axios.get(url).then((res) => {
  //     if (res.status === 200) {
  //       return res.data;
  //     }
  //     return null;
  //   });
}

module.exports = {
  getNpmInfo,
};
