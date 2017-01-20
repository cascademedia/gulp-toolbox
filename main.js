
(function () {
    // libraries
    var _ = require('lodash');
    var browser = require('browser-sync');
    var colors = require('colors');
    var concat = require('gulp-concat');
    var fs = require('fs');
    var moment = require('moment');
    var notifier = require('node-notifier');
    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var uglifyjs = require('gulp-uglify');
    var util = require('gulp-util');

    // functions
    var sprintf = require('sprintf-js').sprintf;

    // variables
    var config = require('./config-defaults.js');
    var gulp = util.noop();
    var watchers = [];
    var tasks = {};

    var initialize = function (gulpInstance, options) {
        gulp = gulpInstance;
        tasks = {
            compile: [],
            default: [],
            watch: []
        };

        config.sourcemaps = !!util.env.sourcemaps;
        config.production = !!util.env.production;

        _.merge(config, options);
        correctConfigurationPaths();

        var getFlagStatus = function (flag) {
            return flag ? 'true'.green : 'false'.red;
        };

        var flags = 'assets[' + getFlagStatus(config.assets.enabled) + ']';
        flags += ' js[' + getFlagStatus(config.js.enabled) + ']';
        flags += ' sass[' + getFlagStatus(config.sass.enabled) + ']';
        flags += ' sync[' + getFlagStatus(config.sync.enabled) + ']';
        flags += ' production[' + getFlagStatus(config.production) + ']';
        flags += ' sourcemaps[' + getFlagStatus(config.sourcemaps) + ']';

        output('flags', flags);

        addAssetsTasks();
        addJSTasks();
        addSASSTasks();
        addSyncTasks();

        addDefaultTasks();
    };

    var addAssetsTasks = function () {
        if (!config.assets.enabled) return;

        tasks.compile.push('assets:compile');
        tasks.default.push('assets:watch');
        tasks.watch.push('assets:watch');

        gulp.task('assets:compile', function () {
            var options = config.assets;
            var target = options.target;
            var pattern = mapOriginGlob(options.origin, options.glob);

            gulp.src(pattern, {base: options.origin})
                .pipe(gulp.dest(target))
                .on('finish', function () {
                    var files = options.glob.map(function (item) {
                        return options.target + '/' + item;
                    }).join(', ');

                    output('write', files);
                });
        });

        gulp.task('assets:watch', ['assets:compile'], function () {
            var cwd = process.cwd();
            var options = config.assets;
            var pattern = mapOriginGlob(options.origin, options.glob);

            watchers.push(gulp.watch(pattern, function (event) {
                var type = event.type;
                var origin = event.path.replace(cwd + '/', '');
                var target = origin.replace(options.origin, options.target);
                var file  = target.split('/').pop();

                switch (type) {
                    case 'deleted':
                        fs.unlink(target, util.noop);
                        break;
                    default:
                        gulp.src(origin)
                            .pipe(gulp.dest(target.replace(file, '')));
                }

                output(type, target);
            }));
        });
    };

    var addDefaultTasks = function () {
        gulp.task('default', tasks.default);
        gulp.task('compile', tasks.compile);
        gulp.task('watch', tasks.watch);
    };

    var addJSTasks = function () {
        if (!config.js.enabled) return;

        tasks.compile.push('js:compile');
        tasks.default.push('js:watch');
        tasks.watch.push('js:watch');

        gulp.task('js:compile:libs', function () {
            compileJS(config.js.libs);
        });

        gulp.task('js:compile:src', function () {
            compileJS(config.js.src);
        });

        gulp.task('js:compile', ['js:compile:libs', 'js:compile:src']);

        gulp.task('js:watch', ['js:compile'], function () {
            var libGlob = mapOriginGlob(config.js.libs.origin, config.js.libs.glob);
            var srcGlob = mapOriginGlob(config.js.src.origin, config.js.src.glob);

            watchers.push(gulp.watch(libGlob, ['js:compile:libs']));
            watchers.push(gulp.watch(srcGlob, ['js:compile:src']));
        });
    };

    var addSASSTasks = function () {
        if (!config.sass.enabled) return;

        tasks.compile.push('sass:compile');
        tasks.default.push('sass:watch');
        tasks.watch.push('sass:watch');

        gulp.task('sass:compile', function () {
            compileSass(config.sass);
        });

        gulp.task('sass:watch', ['sass:compile'], function () {
            var sassGlob = mapOriginGlob(config.sass.origin, config.sass.glob);

            watchers.push(gulp.watch(sassGlob, ['sass:compile']));
        });
    };

    var addSyncTasks = function () {
        if (!config.sync.enabled) return;

        tasks.default.push('browser:watch');

        gulp.task('browser:watch', function () {
            browser.init(config.sync.server);
            watchers.push(gulp.watch(config.sync.glob, browser.reload))
        });
    };

    var compileJS = function (options) {
        var file = options.file;
        var target = options.target;
        var pattern = mapOriginGlob(options.origin, options.glob);

        gulp.src(pattern)
            .pipe(config.sourcemaps ? sourcemaps.init() : util.noop())
            .pipe(config.production ? uglifyjs() : util.noop())
            .pipe(concat(file))
            .pipe(config.sourcemaps ? sourcemaps.write() : util.noop())
            .pipe(gulp.dest(target))
            .on('finish', function () {
                output('write', options.target + '/' + file);
            });
    };

    var compileSass = function (options) {
        var file = options.file;
        var target = options.target;

        if (!options.outputStyle) {
            options.outputStyle = config.production ? 'compressed' : 'expanded';
        }

        gulp.src(options.origin + '/*.scss')
            .pipe(config.sourcemaps ? sourcemaps.init() : util.noop())
            .pipe(sass(options).on('error', displaySassError))
            .pipe(config.sourcemaps ? sourcemaps.write() : util.noop())
            .pipe(concat(file))
            .pipe(gulp.dest(target))
            .on('finish', function () {
                output('write', target + '/' + file);
            });
    };

    var correctPath = function (path) {
        return path.replace(/^\/|\/$/g, '');
    };

    var correctConfigurationPaths = function () {
        var keysToCorrect = ['origin', 'target', 'file'];

        var deepMap = function (obj) {
            _.each(obj, function (item, key) {
                if (_.includes(keysToCorrect, key)) {
                    obj[key] = correctPath(item);
                }

                if (_.isObject(item)) {
                    deepMap(item);
                }
            });
        };

        deepMap(config);
    };

    var displaySassError = function (error) {
        var file = error.file.replace(process.cwd(), '');
        var line = error.line;
        var original = error.messageOriginal;

        var message = 'File: ' + file + ':' + line + ' | ' + original;

        output('error', message, 'red');

        notifier.notify({
            title: 'SASS Watcher',
            message: message
        });
    };

    var mapOriginGlob = function (origin, glob) {
        return _.map(glob, function (item) {
            return origin + '/' + item;
        });
    };

    var output = function (action, message, color) {
        color = color || 'green';

        console.log(sprintf(
            '[%s] %s: %s',
            moment().format('hh:mm:ss'),
            action[color],
            message
        ));
    };

    module.exports = {
        init: initialize
    };
})();
