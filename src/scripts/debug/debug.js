'use strict';
angular.module('iot-call.debug', [])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('debug', {
                url: '/debug',
                abstract: true,
                views: {
                    '': {
                        templateUrl: 'views/debug/debug.html',
                        controller: 'debugController'
                    }
                }
            })
            .state('debug.optimal', {
                url: '/optimallink',
                views: {
                    '': {
                        templateUrl: 'views/debug/optimalLink.html',
                        controller: 'optimalLinkController'
                    }
                }
            });
    }]);
