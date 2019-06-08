module.exports = {
    path: {
        srcDir: 'src',
        distDir: 'dist',
        specDir: 'spec',
        imgDir:'src/assets/images'
    },
    files: {
        entry: '*+(*.pug|*.scss|*.js)',
        img: '**/+(*.jpg|*.png|*.gif)',
    },
    webcomponents: {
        files: 'webcomponents/**/*.js',
        name:'rikaaa-tab',
    },
    karma: {
        frameworks: ['mocha', 'browserify'],
        port: 9876,
        browsers: ['Chrome'],
        files: [
            'dist/*.html',
            {
                pattern: 'dist/images/*+(*.png|*.jpg|*.gif)',
                watch:true,
                included: false,
                served: true,
            },
            {
                pattern: 'dist/*.css',
                watch: true,
                included: false,
                served:true,
            },
            'dist/*.js',
            'spec/*.js',
            'karma-debughtml-refresh.js'
        ],
        proxies: {
            '/images/': '/base/dist/images/',
            '/':'/base/dist/'
        },
        preprocessors: {
            'dist/*.html': ['html2js'],
            'spec/*.js': ['browserify'],
        },
        browserify: {
             transform: [
                 ['babelify', {
                     plugins: ['babel-plugin-espower']
                 }]
             ]
         },
        html2JsPreprocessor: {
             stripPrefix: 'dist/',
        }
    }
};