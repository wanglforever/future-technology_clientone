'use strict';
angular.module('iot-call.login', [])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('login', {
                url: '/login',
                views: {
                    '': {
                        templateUrl: 'views/login/login.html',
                        controller: 'loginController'
                    }
                }
            });
    }]);
