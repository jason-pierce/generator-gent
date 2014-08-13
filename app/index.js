/*jslint node: true, nomen: true, plusplus: true, es5: true */
/*global angular, jquery, $, $http */

'use strict';

var util   = require('util');
var path   = require('path');
var yeoman = require('yeoman-generator');
var yosay  = require('yosay');
var chalk  = require('chalk');

var gent = yeoman.generators.Base.extend({
    init: function () {
        this.pkg = require('../package.json');

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies();
            }
        });
    },

    askFor: function () {
        var done = this.async(),
            prompts = [];

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the marvelous Agilex Angular-Yeo generator!'));

        // Prompts will get info from the user
        prompts = [{
            name: 'appName',
            message: 'What is the Name (ID) of your app?'
        }, {
            type: 'confirm',
            name: 'addAngularApp',
            message: 'Do you want an Angular App generated?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.appName = props.appName;
            this.addAngularApp = props.addAngularApp;

            done();
        }.bind(this));
    },

    scaffoldFolders: function () {
        this.mkdir("build");
        this.mkdir("config");
        this.mkdir("src");
        this.mkdir("src/_assets");
        this.mkdir("src/_assets/sass");
        this.mkdir("src/_assets/bower_components");
        this.mkdir("src/_assets/data");
        this.mkdir("src/_assets/fonts");
        this.mkdir("src/_assets/img");
        this.mkdir("src/common");
        this.mkdir("src/components");
        this.mkdir("src/components/core");
    },

    copyMainFiles: function () {
        // Here we use two new methods, copy and template, which are pretty similar in function. copy will take the file from the templates directory and move it to the output folder, using the provided paths. template does the same thing, except before writing to the output folder it will run it through Underscore's tempting function along with the context in order to fill in the placeholders.
        this.copy('editorconfig', '.editorconfig');
        this.copy('bowerrc', '.bowerrc');
        this.copy('_bower.json', 'bower.json');

        this.copy("_gruntfile.js", "Gruntfile.js");
        this.copy("_package.json", "package.json");
        this.copy("config/compass.config.rb", "config/compass.config.rb");

        this.copy("_assets/sass/main.scss", "src/_assets/sass/main.scss");
        this.copy("_assets/sass/_partials/_buttons.scss", "src/_assets/sass/_partials/_buttons.scss");
        this.copy("_assets/sass/_partials/_type.scss", "src/_assets/sass/_partials/_type.scss");

        this.copy("components/core/_footer.jade", "src/components/core/_footer.jade");

        this.copy("components/home/home.js", "src/components/home/home.js");
        this.copy("components/home/home_spec.js", "src/components/home/home_spec.js");
        this.copy("components/home/home_template.jade", "src/components/home/home_template.jade");

        this.copy("components/login/login.js", "src/components/login/login.js");

        this.copy("components/app.js", "src/components/app.js");

        var context = {
            site_name: this.appName
        };

        this.template("_index.jade", "src/index.jade", context);
        // Karma has to be in root because of bower. for now.
        this.template("config/karma.conf.js", "karma.conf.js", context);

        // Here is the start where you can branch out and make multiple generators.
        if (this.addAngularApp) {
            
        }
    },
    runNpm: function () {
        var done = this.async();
        this.npmInstall("", function () {
            console.log("\nEverything Setup !!!\n");
            done();
        });
    }
});

module.exports = gent;
