/*jslint node: true */
/*global angular, jquery, $, $http */

'use strict';

var util   = require('util');
var path   = require('path');
var yeoman = require('yeoman-generator');
var yosay  = require('yosay');
var chalk  = require('chalk');

var ngGenerator = yeoman.generators.Base.extend({
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
        this.mkdir("app");
        this.mkdir("app/css");
        this.mkdir("app/sections");
        this.mkdir("build");
    },

    copyMainFiles: function () {
        // Here we use two new methods, copy and template, which are pretty similar in function. copy will take the file from the templates directory and move it to the output folder, using the provided paths. template does the same thing, except before writing to the output folder it will run it through Underscore's tempting function along with the context in order to fill in the placeholders.
        this.copy('editorconfig', '.editorconfig');
        this.copy('jshintrc', '.jshintrc');

        this.copy("_footer.html", "app/footer.html");
        this.copy("_gruntfile.js", "Gruntfile.js");
        this.copy("_package.json", "package.json");
        this.copy("_main.css", "app/css/main.css");

        var context = {
            site_name: this.appName
        };

        this.template("_header.html", "app/header.html", context);
    },
    generateDemoSection: function () {
        if (this.addDemoSection) {
            var context = {
                content: "Demo Section",
                id: this._.classify("Demo Section")
            };

            var fileBase = Date.now() + "_" + this._.underscored("Demo Section");
            var htmlFile = "app/sections/" + fileBase + ".html";
            var cssFile  = "app/css/" + fileBase + ".css"; 

            this.template("_section.html", htmlFile, context);
            this.template("_section.css", cssFile, context);
        }
    },
    generateMenu: function () {
        var menu = this.read("_menu.html");

        var t = '<a><%= name %></a>';
        var files = this.expand("app/sections/*.html");

        for (var i = 0; i < files.length; i++) {
            var name = this._.chain(files[i]).strRight("_").strLeftBack(".html").humanize().value();
       
            var context = {
                name: name,
                id: this._.classify(name)
            };
       
            var link = this.engine(t, context);
            menu = this.append(menu, "div.menu", link);
        }
     
        this.write("app/menu.html", menu);
    },
    runNpm: function(){
        var done = this.async();
        this.npmInstall("", function(){
            console.log("\nEverything Setup !!!\n");
            done();
        });
    }
});

module.exports = ngGenerator;
