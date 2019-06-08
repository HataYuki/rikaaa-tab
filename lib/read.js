/*jshint esversion: 8 */
const fs = require('fs-extra');
const { promisify } = require('util');
module.exports = async (filePath) => {
    return promisify(fs.readFile)(filePath);
};