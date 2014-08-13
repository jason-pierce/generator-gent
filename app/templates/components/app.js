/*jslint node: true, unparam: true */
/*globals angular */

'use strict';

// Declare app level module which depends on filters, and services
var app;
app = angular.module('APP', [
    'ui.bootstrap',
    'ngRoute',
    'ngCookies',
    'ngResource',
    'APP.home',
    'APP.login'
]);
app.config([
    '$routeProvider',
    function ($routeProvider) {
        // ----------------------------------------------------------------------
        // ROUTING
        // ----------------------------------------------------------------------
        $routeProvider.when('/home', {
            templateUrl: 'components/home/home_template.html',
            controller: 'HomeCtrl'
        });
        $routeProvider.otherwise({
            redirectTo: '/home'
        });
    }
]).run([
    '$rootScope',
    '$location',
    '$http',
    '$log',
    '$timeout',
    function ($rootScope, $location, $http, $log, $timeout) {
        // ----------------------------------------------------------------------
        // APP Load
        // ----------------------------------------------------------------------
        $log.info('APP root module just ran');
        $rootScope.locals = {
            user: {
                name: "Paul Harvey",
                dob: "05/15/55",
                role: "user"
            },
            isAuthenticated: true
        };
    }
]);

