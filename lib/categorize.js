/*jshint esversion: 8 */
module.exports = (config,fileall) => {
    const files = [...fileall];
    const category = config.category;
    const ob = {};
    for (let key in category) {
        ob[key] = [];
    }
    return files.reduce((a, c) => {
        const bufferob = {};
        for (let key in category) {
            if (c.match(category[key])) bufferob[key] = c;
        }
        const key = Object.keys(bufferob)[0];
        return Object.assign(a, a[key].push(bufferob[key]));
    }, ob);
}