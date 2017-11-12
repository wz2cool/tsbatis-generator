(function () {
    'use strict';
    angular.module('myApp').config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'views/home/index.html'
            })
            .state('entitygenerator', {
                url: '/entitygenerator',
                templateUrl: 'views/entitygenerator/index.html'
            })
    }]);
})();