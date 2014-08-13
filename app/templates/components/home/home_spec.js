/*jslint node: true, unparam: true  */
/*global angular, it, describe, beforeEach, inject, jasmine, spyOn, afterEach, expect */

'use strict';

/* jasmine specs for controllers go here */
describe('APP: Home Page', function () {
    var scope,
        controller;

    beforeEach(function () {
        // Define any underlying mock data.

        // We load all the module dependancies up front.
        module('APP.home');

        //Injecting all of our services in the "beforeEach" section allows us to avoid cluttering out tests.    
        inject(function ($controller, $rootScope) {
            scope                       = $rootScope.$new();
            controller                  = $controller('HomeCtrl', {
                $scope: scope
            });
            scope.testForJSLint = controller;
            scope.$digest();
        });
    });

    describe('Base functions are defined', function () {
        it('should have the valueForUnitTest scope variable', function () {
            expect(scope.valueForUnitTest).not.toBeUndefined();
            expect(scope.valueForUnitTest).toBe(true);
        });
    });
});

