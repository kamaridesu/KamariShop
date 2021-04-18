const fs = require("fs");
const util = require("util");

const mkdir = util.promisify(fs.mkdir);
const rmdir = util.promisify(fs.rmdir);
const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

module.exports = { mkdir, rmdir, readdir, unlink };
