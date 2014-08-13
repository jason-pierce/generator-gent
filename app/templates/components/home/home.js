/*jslint node: true, unparam: true */
/*globals angular */

'use strict';

angular.module('APP.home', []).controller('HomeCtrl', [
    '$scope',
    '$http',
    '$log',
    '$rootScope',
    '$location',
    function ($scope, $http, $log, $rootScope, $location) {
        $log.info('INFO: Scope is: HomeCtrl');
        $scope.valueForUnitTest = true;
        $scope.nested = "Set at Home Level";
    }
]);