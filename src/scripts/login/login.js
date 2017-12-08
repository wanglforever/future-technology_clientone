'use strict';
angular.module('udbs.login', [])
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
