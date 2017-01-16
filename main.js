
(function () {
    // libraries
    var _ = require('lodash');
    var colors = require('colors');
    var concat = require('gulp-concat');
    var moment = require('moment');
    var notifier = require('node-notifier');
    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');
    var uglifyjs = require('gulp-uglify');
    var util = require('gulp-util');

    var config = require('./config-defaults.js');

    var initialize = function (gulp, options) {
        setConfigurations(options);


    };

    var setConfigurations = function (options) {
        console.log(config, options, 'red'.red);


    };



    module.exports = {
        init: initialize
    };
})();
