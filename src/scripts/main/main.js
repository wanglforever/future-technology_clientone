'use strict';
angular.module('udbs.main',[])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'views/main/main.html',
                controller: 'mainController'
            });
    }]);
