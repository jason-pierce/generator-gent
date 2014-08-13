/*jslint node: true, plusplus: true, unparam: true */
/*global angular, jquery, $, $http */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        // https://github.com/gruntjs/grunt-contrib-watch
        // Run predefined tasks whenever watched file patterns are added, changed or deleted.
        watch: {
            compass: {
                files: ['src/_assets/sass/*.scss', 'src/_assets/**/*.scss'],
                tasks: ['compass']
            },
            jade: {
                files: ["src/**/*.jade", "*.jade"],
                tasks: ['jade']
            },
            scripts: {
                files: ['src/**/*.js', '!src/lib/**/*.js'],
                tasks: ['jslint:server', 'copy'],
                options: {
                    spawn: false
                }
            }
        },

        // grunt-contrib-clean
        // Clean files and folders.
        clean: [
            'src/components/core/main.js',
            'src/components/core/lib.js',
            'build',
            '.sass-cache',
            'logs',
            '.tmp'
        ],
        // grunt-wiredep
        // grunt-wiredep is a Grunt plug-in, which finds your components and injects them directly into the HTML file you specify.
        wiredep: {
            target: {
                src: [
                    'src/*.jade',                   // .jade support...
                    'src/_assets/sass/main.scss'     // .scss & .sass support...
                ],
                // Optional:
                // ---------
                cwd: '',
                dependencies: true,
                devDependencies: false,
                exclude: [],
                fileTypes: {},
                ignorePath: '',
                overrides: {}
            },
            testKarma: {
                src: [
                    './karma.conf.js'
                ],
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js:  /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                },
                devDependencies: true,
                exclude: [/angular-scenario/, /jasmine/]
            }
        },

        // grunt-contrib-jade
        // Generate HTML from Jade Templates.
        jade: {
            compileModules: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['**/*.jade'],
                        dest: 'build/',
                        ext: '.html'
                    }
                ]
            }
        },
        // grunt-contrib-compass
        // Generate CSS from SASS
        compass: {
            dist: {
                options: {
                    config: 'config/compass.config.rb'
                },
                files: {
                    'build/_assets/css/main.css': 'src/_assets/sass/main.scss'
                }
            }
        },
        // grunt-jslint
        // Validate the JS using the opinionated JSLint
        jslint: {
            server: {
                src: [
                    'src/**/*.js'
                ],
                exclude: [
                    'src/_assets/bower_components/**/*.js',
                    'src/components/core/main.js',
                    'src/components/core/lib.js',
                    'src/**/*.min.js'
                ],
                directives: {
                    browser: true,
                    node: true,
                    plusplus: true,
                    unparam: true,
                    predef: [
                        'angular'
                    ]
                },
                options: {
                    junit: 'logs/server-junit.xml', // write the output to a JUnit XML
                    log: 'logs/server-lint.log',
                    jslintXml: 'logs/server-jslint.xml',
                    errorsOnly: true, // only display errors
                    checkstyle: 'logs/server-checkstyle.xml' // write a checkstyle-XML
                }
            }
        },
        // grunt-karma
        // Unit Testing for Angular.
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['Chrome']
            }
        },

        // grunt-styleguide
        // Universal CSS styleguide generator for grunt. Easily integrate Styledocco or KSS styleguide generation into your development workflow.
        styleguide: {
            options: {
                template: {
                    src: 'node_modules/grunt-styleguide/templates/kss/index.html'
                },
                framework: {
                    name: 'kss'
                }
            },
            all: {
                files: [{
                    'src/styleguide': 'src/_assets/sass/**/*.scss'
                }]
            }
        },
        // grunt-contrib-copy
        // Copy files and folders.
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: [
                    '**', 
                    '!**/*.jade',
                    '!_assets/sass/*.scss',
                    '!_assets/sass/**/*.scss'
                ],
                dest: 'build/'
            },
            assets: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/_assets/',
                        src: [ '**',
                            '!sass/**/*.scss'],
                        dest: 'build/_assets/'
                    }
                ]
            },
            glyphicons: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/_assets/bower_components/bootstrap-css/fonts/',
                        src: [ '**',
                            '!sass/**/*.scss'],
                        dest: 'build/_assets/fonts/'
                    }
                ]
            }
        },
 
        // grunt-usemin
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: 'src/index.jade',
            options: {
                dest: 'src'
            }
        },
        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['build/index.html'],
            css: ['build/_assets/css/main.css'],
            options: {
                dest: 'build'
            }
        },

        // grunt-contrib-uglify
        // Minify files with UglifyJS.
        uglify: {
            options: {
                sourceMap: true,
                mangle: false,
                beautify: true
            }
        },

    });






    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-styleguide');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [ 
        'clean',
        'wiredep',
        'compass',
        'jslint',
        'useminPrepare',
        'jade',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'copy:main',
        'copy:assets',
        'copy:glyphicons'
    ]);
    grunt.registerTask('deploy', [ 'build' ]);
    grunt.registerTask('default', [ 'build', 'watch' ]);
};