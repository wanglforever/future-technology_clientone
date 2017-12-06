'use strict';
angular.module('iot-call.call', [])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main.call', {
                url: '/call',
                templateUrl: 'views/call/call.html',
                controller: 'callController'
            });
    }]);
