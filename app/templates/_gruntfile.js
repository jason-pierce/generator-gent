/*jslint node: true, plusplus: true */
/*global angular, jquery, $, $http */

'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        //task config
        concat: {
            dist: {
                src: ["app/header.html", "app/menu.html", "app/sections/*.html", "app/footer.html"],
                dest: "build/index.html"
            }
        },
        cssmin: {
            css: {
                files: {
                    "build/css/main.css": ["app/css/*.css"]
                }
            }
        },
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

    grunt.registerTask('serve', ['connect']);
    grunt.registerTask('build', ['concat', 'cssmin']);
    grunt.registerTask('default', ['build']);
};