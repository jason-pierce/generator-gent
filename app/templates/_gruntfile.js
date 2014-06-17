/*jslint node: true, plusplus: true, unparam: true */
/*global angular, jquery, $, $http */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        //task config
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
                        cwd: 'src/app/',
                        src: ['**/*.jade'],
                        dest: 'build/app/',
                        ext: '.html'
                    }
                ]
            },
            index: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: {
                    "build/index.html": "src/index.jade"
                }
            },
            redirect: {
                options: {
                    data: {
                        debug: true
                    },
                    pretty: true
                },
                files: {
                    "build/redirect.html": "src/redirect.jade"
                }
            }
        },
        compass: {
            dist: {
                options: {
                    config: 'config/config.rb',
                    require: ['bourbon']
                },
                files: {
                    'build/_assets/css/pc3.css': 'src/_assets/sass/pc3.scss'
                }
            }
        },
        jslint: {
            gruntfile: {
                src: [
                    'Gruntfile.js'
                ],
                directives: {
                    node: true
                },
                options: {
                    errorsOnly: true
                }
            },
            server: {
                src: [
                    'src/**/*.js'
                ],
                exclude: [
                    'src/lib/**/*.js',
                    'src/**/*.min.js',
                    'src/app/_globals/services-modal.js',
                    'src/styleguide/**/*.js'
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

        karma: {
            unit: {
                configFile: 'config/karma.conf.js',
                runnerPort: 9999,
                singleRun: true,
                browsers: ['Chrome']
            }
        },

        styleguide: {
            options: {
                template: {
                    src: 'src/lib/grunt-styleguide-0.2.15'
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

        watch: {
            gruntfile: {
                files: 'Gruntfile.js',
                tasks: ['jslint:gruntfile']
            },
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
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    'src/js/**/*.js', '!src/lib/**/*.js',
                    'src/_assets/sass/*.css', '*'
                ]
            }
        },

        ngmin: {
            all_js_files: {
                expand: true,
                cwd: 'src/',
                src: [
                    'app/**/*.js',
                    'lib/**/*.js'
                ],
                dest: 'build/'
            }
        },

        useminPrepare: {
            options: {
                dest: 'build'
            },
            html: 'app/index.html'
        },
        usemin: {
            options: {
                dirs: ['build']
            },
            html: ['build/{,*/}*.html'],
            css: ['build/_assets/css/{,*/}*.css']
        },

        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: [
                        '**/**/*.js'
                    ],
                    dest: 'build/'
                }]
            }
        },

        concat: {
            options: {
                separator: ';'
            },
            all_js_files: {
                src: ['build/app/**/*.js'],
                dest: 'build/main.js'
            }
        },

        //  concat: {
        //      dist: {
        //          src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
        //          dest: "build/index.html"
        //      }
        //  },
        //  cssmin: {
        //      css: {
        //          files: {
        //              "build/css/main.css": ["app/css/*.css"]
        //          }
        //      }
        //  },

        connect: {
            server: {
                options: {
                    keepalive: true,
                    open: true,
                    middleware: function () {
                        // Two resources we need to handle, the root resource (our "index.html") in which case we need to combine all our HTML files and return them and then the "main.css" resource, in which case we would want to return all the CSS files combined together. As for anything else, we can just return a 404.
                        var middleware = [];
                        middleware.push(function (req, res, next) {
                            var html,
                                files,
                                i;
                            if (req.url !== "/") {
                                return next();
                            }
                            res.setHeader("Content-type", "text/html");

                            html = grunt.file.read("app/header.html");
                            html += grunt.file.read("app/menu.html");

                            files = grunt.file.expand("app/sections/*.html");
                            for (i = 0; i < files.length; i++) {
                                html += grunt.file.read(files[i]);
                            }

                            html += grunt.file.read("app/footer.html");
                            res.end(html);
                        });
                        middleware.push(function (req, res, next) {
                            var css,
                                files,
                                i;
                            if (req.url !== "/css/main.css") {
                                return next();
                            }
                            res.setHeader("Content-type", "text/css");
                            css = "";

                            files = grunt.file.expand("app/css/*.css");
                            for (i = 0; i < files.length; i++) {
                                css += grunt.file.read(files[i]);
                            }

                            res.end(css);
                        });
                        middleware.push(function (req, res) {
                            res.statusCode = 404;
                            res.end("Not Found");
                        });
                        return middleware;
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('build', ['concat', 'cssmin']);
    grunt.registerTask('default', ['build']);

    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-styleguide');
    grunt.loadNpmTasks('grunt-ngmin');

    grunt.registerTask('test', [ 'jslint', 'jasmine' ]);
    grunt.registerTask('uglimin', [ 'ngmin', 'uglify' ]);
    grunt.registerTask('build', [ 'jade', 'compass', 'jslint', 'karma', 'copy:assets', 'useminPrepare', 'usemin', 'uglimin' ]);
    grunt.registerTask('build-without-test', [ 'jade', 'compass', 'jslint', 'copy:assets', 'uglimin' ]);
    grunt.registerTask('ci-build', [ 'jade', 'compass', 'jslint', 'copy' ]);
    grunt.registerTask('deploy', [ 'build' ]);
    grunt.registerTask('default', [ 'build', 'watch' ]);
};