/*jshint esversion: 8 */
const glob = require('glob');
const { promisify } = require('util');
const path = require('path');
module.exports = async (config) => {
    const srcDir = config.path.srcDir;
    const entry = config.files.entry;
    const webcomponents = config.webcomponents.files;
    const img = config.files.img;
    const filesObject = {
        entry: path.join(srcDir,entry),
        webcomponents: path.join(srcDir, webcomponents),
        img: path.join(srcDir, img),
    };

    for (let v in filesObject) filesObject[v] = await promisify(glob)(filesObject[v]);
    return await filesObject;
};