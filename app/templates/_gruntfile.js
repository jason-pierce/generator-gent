/*jslint node: true, plusplus: true, unparam: true */
/*global angular, jquery, $, $http */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        // grunt-contrib-jade
        // Generate HTML from Jade Templates.
        jade: {
            compileModules: {
                options: {
                    data: {
                        debug: true,
                        timestamp: "<%= new Date().getTime() %>"
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
                    'build/_assets/css/pc3.css': 'src/_assets/sass/pc3.scss'
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
                    'src/**/*.min.js'
                ],
                directives: {
                    browser: true,
                    node: true,
                    plusplus: true,
                    unparam: true,
                    globals: {
                        // 'jQuery' etc.
                    }
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
                configFile: 'config/karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['Chrome']
            }
        },

        // grunt-wiredep
        // grunt-wiredep is a Grunt plug-in, which finds your components and injects them directly into the HTML file you specify.
        wiredep: {
            target: {
                src: [
                    'src/*.jade',                   // .jade support...
                    'src/_assets/sass/pc3.scss'     // .scss & .sass support...
                ],
                // Optional:
                // ---------
                cwd: '',
                dependencies: true,
                devDependencies: true,
                exclude: [],
                fileTypes: {},
                ignorePath: '',
                overrides: {}
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

        // grunt-contrib-clean
        // Clean files and folders.
        clean: [
            'build', 
            '.tmp'
        ],

        // grunt-contrib-copy
        // Copy files and folders.
        copy: {
            main: {
                expand: true,
                cwd: 'src/',
                src: [
                    '**', 
                    '!**/*.jade',
                    '!_assets/sass'
                ],
                dest: 'build/'
            }
        },
 
        // grunt-usemin
        // Replaces references from non-optimized scripts, stylesheets and other assets to their optimized version within a set of HTML files (or any templates/views).
        useminPrepare: {
            html: 'src/index.jade'
        },
        usemin: {
            html: ['src/index.jade']
        },
        // grunt-contrib-uglify
        // Minify files with UglifyJS.
        uglify: {
            options: {
                sourceMap: true,
                report: 'min',
                mangle: false
            }
        },


        // https://github.com/gruntjs/grunt-contrib-watch
        // Run predefined tasks whenever watched file patterns are added, changed or deleted.
        watch: {
            compass: {
                files: ['src/_assets/sass/*.scss', 'src/_assets/**/*.scss'],
                tasks: ['compass']
            },
            jade: {
                files: ["src/app/**/*.jade", "*.jade"],
                tasks: ['jade', 'jade:index', 'karma']
            },
            scripts: {
                files: ['src/**/*.js', '!src/lib/**/*.js'],
                tasks: ['jslint:server', 'karma', 'copy'],
                options: {
                    spawn: false
                }
            }
        },
    });






    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
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
        'jade',
        'compass',
        'jslint',
        'copy:main',
        'useminPrepare',
        'usemin',
        'uglify'
    ]);
    grunt.registerTask('deploy', [ 'build' ]);
    grunt.registerTask('default', [ 'build', 'watch' ]);
};