const nodecache = require("node-cache");

const appCache = new nodecache({ stdTTL: 60 });

module.exports = appCache;
