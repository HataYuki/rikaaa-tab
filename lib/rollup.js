/*jshint esversion: 8 */
const rollup = require('rollup');
const noderesolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const sass = require('./sass');

module.exports = async (path, build) => {
    let inputOptions = {
        input: path,
        plugins: [
            babel({
                exclude: 'node_modules/**',
                runtimeHelpers: true,
                presets: [
                    ['@babel/preset-env', {
                        'targets': {
                            ie: '11',
                        },
                    }]
                ],
                plugins: [
                    ['@babel/plugin-transform-runtime', {
                        'corejs':3
                    }],
                ]
            }),
            noderesolve(),
            commonjs({
                include: /node_modules/,
            }),
        ]
    };
    const external = {
        external: [
            '@webcomponents/webcomponentsjs/webcomponents-bundle',
            '@webcomponents/shadycss/scoping-shim.min',
        ]
    };

    if (build) inputOptions = Object.assign(inputOptions, external);

    const outputOptions = {
        format: 'iife',
    };
    const bundle = await rollup.rollup(inputOptions);
    const { output } = await bundle.generate(outputOptions);

    if (output[0].code.match(/\$\{\{\{.*\}\}\}/g)) {
        const inputcssTarget = output[0].code.match(/\$\{\{\{.*\}\}\}/g)[0];
        const scssPath = inputcssTarget.replace('\$\{\{\{', '').replace('}}}', '');
        const csscode = await sass(scssPath);
        return output[0].code.replace(/\$\{\{\{.*\}\}\}/g, csscode.replace(/\n|\r\n|\r/g,''));
    } else {
        return output[0].code;
    }
    
    
    
    
    
};
