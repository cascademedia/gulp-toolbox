
module.exports = {
    assets: {
        enabled: false,
        origin: 'app/resources',
        target: 'web/resources',
        glob: [
            'fonts/**',
            'images/**'
        ]
    },
    js: {
        enabled: false,
        libs: {
            origin: 'app/resources/js/libs',
            target: 'web/resources/js',
            file: 'libs.js',
            glob: [
                '**/*.js'
            ]
        },
        src: {
            origin: 'app/resources/js',
            target: 'web/resources/js',
            file: 'main.js',
            glob: [
                '*.js'
            ]
        }
    },
    sass: {
        enabled: false,
        precision: 9,
        origin: 'app/resources/sass',
        target: 'web/resources/css',
        file: 'main.css',
        glob: [
            '**/*.scss'
        ]
    },
    sync: {
        enabled: false,
        glob: [
            'web/resources/**'
        ],
        server: {
            host: '127.0.0.1',
            proxy: 'http://localhost:8081/',
            port: 8082,
            notify: false
        }
    },
    production: false,
    sourcemaps: false
};
