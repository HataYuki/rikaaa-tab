/*jshint esversion: 9 */
const config = require('./config/config');
// const fileList = require('./lib/file'); 
// const categorize = require('./lib/categorize');
const files = require('./lib/files');
const rollup = require('./lib/rollup');
const sass = require('./lib/sass');
const pug = require('./lib/pug');
const karma = require('./lib/karma');
const fs = require('fs-extra');
const path = require('path');
const bs = require('browser-sync');
const gaze = require('gaze');
const glob = require('glob');
const uglify = require('uglify-js');
const hostPath = process.argv[1];
const cmd = process.argv[2];

const changeToDistPath = (srcPath) => {
    return srcPath
        .replace('src', config.path.distDir)
        .replace('\/webcomponents', '')
        .replace('\/assets','')
        .replace(/\.pug$/, '.html')
        .replace(/\.scss$/, '.css');
};

const buildPug = async (pubPath) => {
    const d = await pug(pubPath);
    const distpath = changeToDistPath(pubPath);
    return new Promise((resolve, reject) => {
        fs.outputFile(distpath, d, err => {
            if (err === null) {
                resolve({
                    target:'pug',
                    status: 'succes',
                    resorce: pubPath,
                    output: distpath,
                });
            } else {
                reject(err);
            }
        });
    });
};

const buildSass = async (sassPath) => {
    const d = await sass(sassPath);
    const distpath = changeToDistPath(sassPath);
    return new Promise((resolve, reject) => {
        fs.outputFile(distpath, d, err => {
            if (err === null) {
                resolve({
                    target:'sass',
                    status: 'succes',
                    resorce: sassPath,
                    output:distpath,
                });
            } else {
                reject(err);
            }
        });
    });
};

const buildJs = async (jsPath) => {
    const d = await rollup(jsPath);
    const distpath = changeToDistPath(jsPath);
    return new Promise((resolve, reject) => {
        fs.outputFile(distpath, d, err => {
           if (err === null) {
               resolve({
                   target:'js',
                   status: 'succes',
                   resorce: jsPath,
                   output: distpath,
               });
           } else {
               reject(err);
           }
        });
    });
};

const output = async (pathArray) => {
    return Promise.all(pathArray.map(v => {
        if (v.match(/\.pug$/)) return buildPug(v);
        if (v.match(/\.scss$/)) return buildSass(v);
        if (v.match(/\.js$/)) return buildJs(v);
    })).then(info => {
        console.table(info);
        console.log('output complete');
    }).catch(err => {
        console.log(err);
    });
};

const copyImg = async () => {
    glob(config.path.imgDir, (err, data) => {
        const src_array = [...data];
        const dist_array = [...src_array].map(v => changeToDistPath(v));
        const copy = dist_array.map((dist,i) => {
            return new Promise((resolve, reject) => {
                fs.remove(dist, err => {
                    if (err) reject(err);
                    fs.copy(src_array[i], dist, (err) => {
                        if (err) reject(err);
                        else resolve({
                            target: 'img',
                            status: 'succes',
                            resorce: src_array[0],
                            output: dist,
                        });
                    });
                });
            });
        });
        return Promise.all(copy)
            .then(state => {
                console.table(state);
                console.log('img copy success');
            })
            .catch(err => console.log(err));
    });
};

const watchStart = async () => {
    const fileall = { ... await files(config) };
    const entrys = [...fileall.entry].concat([...fileall.webcomponents]);
    await output(entrys);
    await copyImg();
    bs.init({server: config.path.distDir});
    gaze(path.join(config.path.srcDir, '**/*'), (err, watcher) => {
        if (err) console.error(err);
        watcher.on('all', async (ev, file) => { 
            const path = file.replace(hostPath.replace('index.js', ''), '');
            if (path.match(/(\.png|\.jpg|\.gif)$/)) await copyImg();
            else if (entrys.includes(path)) await output([path]);
            else await output(entrys);
            bs.reload();
        });
    });
};

const build = async () => {
    const wcf = () => {
        return new Promise((resolve, reject) => {
            glob(path.join(config.path.srcDir, config.webcomponents.files), (err, data) => {
                if (err) reject(err);
                resolve(data);
           });
        });
    };
    const datas = async () => {
        const paths = await wcf();
        return Promise.all(paths.map(async path => await rollup(path, true)));
    };
    const d = await datas();
    const outputpath = path.join('./', `${config.webcomponents.name}.js`);
    d.forEach(c => {
        const min_code = uglify.minify(c).code;
        fs.outputFile(outputpath, min_code, err => {
            if (err) console.error(err);
            else console.log('build success');
        });
    });
};

const karmaStart = async () => {
    const fileall = { ... await files(config) };
    const entrys = [...fileall.entry].concat([...fileall.webcomponents]);
    await output(entrys);  
    karma(config);
    gaze(path.join(config.path.srcDir, '**/*'), (err, watcher) => {
        if (err) console.error(err);
        watcher.on('all', async (ev, file) => {
            const path = file.replace(hostPath.replace('index.js', ''), '');
            if (path.match(/(\.png|\.jpg|\.gif)$/)) await copyImg();
            else if (entrys.includes(path)) await output([path]);
            else await output(entrys);
        });
    });
};


switch (cmd) {
    case 'watch':
        watchStart();
        break;
    case 'build':
        build();
        break;    
    case 'karma':
        karmaStart();
        break;
    case 'serverStart':
        bs.init({
            server: config.path.distDir
        });
        break;
}
