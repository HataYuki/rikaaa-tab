const pug = require('pug');

module.exports = async (path) => {
    return await pug.renderFile(path, {});
};