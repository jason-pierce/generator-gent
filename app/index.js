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
            message: 'What is the name of your app?'
        }, {
            type: 'confirm',
            name: 'addDemoSection',
            message: 'Do you want a demo generated?',
            default: true
        }];

        this.prompt(prompts, function (props) {
            this.appName = props.appName;
            this.addDemoSection = props.addDemoSection;

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
        this.mkdir("src/components");
        this.mkdir("src/components/_globals");
    },

    copyMainFiles: function () {
        // Here we use two new methods, copy and template, which are pretty similar in function. copy will take the file from the templates directory and move it to the output folder, using the provided paths. template does the same thing, except before writing to the output folder it will run it through Underscore's tempting function along with the context in order to fill in the placeholders.
        this.copy('editorconfig', '.editorconfig');
        this.copy('bowerrc', '.bowerrc');
        this.copy('_bower.json', 'bower.json');

        // this.copy("_index.jade", "src/index.jade");
        this.copy("_gruntfile.js", "Gruntfile.js");
        this.copy("_package.json", "package.json");
        this.copy("config/compass.config.rb", "config/compass.config.rb");
        // this.copy("templates/config/karma.conf.js", "config/karma.conf.js");
        this.copy("components/_globals/_footer.jade", "src/components/_globals/_footer.jade");
        this.copy("_assets/sass/main.scss", "src/_assets/sass/main.scss");
        this.copy("_assets/sass/_partials/_buttons.scss", "src/_assets/sass/_partials/_buttons.scss");
        this.copy("_assets/sass/_partials/_type.scss", "src/_assets/sass/_partials/_type.scss");

        var context = {
            site_name: this.appName
        };

        this.template("_index.jade", "src/index.jade", context);
        this.template("config/karma.conf.js", "config/karma.conf.js", context);
    },
    generateDemoSection: function () {
        // Another function that you may not be familiar with is the classify function, which is provided to you by Underscore Strings. What it does is it takes a string and it creates a "class" version of it, it will remove things like spaces and create a camel-cased version, suitable for things like HTML classes and IDs; underscored does the same thing except instead of camel-casing it snake-cases them. Besides that, it's all stuff we have done in the previous function, the only other thing worth mentioning is that we are pre-pending a time-stamp, both to keep the files unique but also for ordering. When we load the files in, they are alphabetized so having the time as the prefix will keep them in order.
        if (this.addDemoSection) {
            var context,
                fileBase,
                htmlFile,
                cssFile;
            context = {
                content: "Demo Section",
                id: this._.classify("Demo Section")
            };

            fileBase = Date.now() + "_" + this._.underscored("Demo Section");
            htmlFile = "src/components/sections/" + fileBase + ".html";
            cssFile  = "src/_assets/css/" + fileBase + ".css";

            this.template("_section.html", htmlFile, context);
            this.template("_section.css", cssFile, context);
        }
    },
    generateMenu: function () {
        var menu,
            t,
            files,
            i,
            name,
            context,
            link;
        menu = this.read("_menu.html");

        t = '<a><%= name %></a>';
        files = this.expand("src/components/*.html");

        for (i = 0; i < files.length; i++) {
            name = this._.chain(files[i]).strRight("_").strLeftBack(".html").humanize().value();

            context = {
                name: name,
                id: this._.classify(name)
            };

            link = this.engine(t, context);
            menu = this.append(menu, "div.menu", link);
        }

        this.write("src/menu.html", menu);
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
