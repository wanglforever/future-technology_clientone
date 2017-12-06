'use strict';
angular.module('iot-call.main', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '',
                abstract: true,
                templateUrl: 'views/main/main.html',
                controller: 'mainController'
            });
    }]);
