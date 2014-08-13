/*jslint node: true, unparam: true */
/*globals angular */

'use strict';

angular.module('APP.login', []).controller('LoginCtrl', [
    '$scope',
    '$http',
    '$log',
    '$rootScope',
    '$location',
    function ($scope, $http, $log, $rootScope, $location) {
        $log.info('INFO: Scope is: LoginCtrl');
        $scope.valueForUnitTest = true;
        $rootScope.locals.login = {
            show: true
        };
        $scope.nested = "Set at Login Level";
    }
]);