/*jslint node: true */
/*global angular, debug, window */

'use strict';

module.exports = function (config) {
    // Saving a globbed object of the bower components
    prodComponents = Object.keys(grunt.file.readJSON('./bower.json').dependencies).map(
        function (prodComponent) {
            return prodComponent + "/**/*";
        }
    );
    config.set({
        basePath : '../',

        files : [
            // bower:js
            // endbower
            ,'/src/components/**/*.js',
            
            '/src/components/**/*.spec.js'
        ],
        autoWatch : true,
        frameworks: ['jasmine'],
        //  config.LOG_DISABLE
        //  config.LOG_ERROR
        //  config.LOG_WARN
        //  config.LOG_INFO
        //  config.LOG_DEBU
        logLevel : config.LOG_INFO,
        loggers : [{type: 'console'}],
        plugins : [
            'karma-junit-reporter',
            'karma-coverage',
            'karma-spec-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
        ],
        reporters: ['spec', 'coverage'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            '**/src/js/*.js': ['coverage'],
            '**/src/js/**/*.js': ['coverage'],
            '**/src/app/**/*.js': ['coverage'],
            '**/src/app/**/**/*.js': ['coverage']
        },
        coverageReporter: {
            type : 'cobertura',
            dir : 'logs/'
        },
        junitReporter : {
            outputFile: 'logs/unit.xml',
            suite: 'unit'
        },

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        // singleRun : false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers : ['Chrome'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout : 60000,

        // enable / disable colors in the output (reporters and logs)
        colors: true
    });
};
