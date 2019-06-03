/*jshint esversion: 8 */
const sass = require('node-sass');
const packageImporter = require('node-sass-package-importer');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

// const fs = require('fs-extra');

module.exports = async (path) => {
    const option = {
        file: path,
        importer: packageImporter(),
    };
    return new Promise((resolve, reject) => {
        sass.render(option, (err, data) => {
            if (err) reject(err);
            if (data !== null) postcss([autoprefixer({
                    grid: true,
                    browsers: [
                        '> 1%',
                        'last 6 versions',
                        'Firefox ESR',
                    ]
                })])
                .process(data.css, {
                    from: path
                })
                .then(result => {
                    // fs.writeFile('./src/test.css', result.css);
                    resolve(result.css);
                });
        });
    });
};
