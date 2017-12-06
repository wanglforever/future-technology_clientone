'use strict';
angular.module('iot-call', [
        'ui.router',
        'iot-call.common',
        'iot-call.backup',
        'iot-call.main',
        'iot-call.login',
        'iot-call.call',
        'iot-call.setting',
        'iot-call.debug'
    ])
    .config(['$urlRouterProvider', '$locationProvider',
        function($urlRouterProvider, $locationProvider) {
            /*html5mode will be true, when release,
             this is auto build, don't need modify*/
            // 发布版本是html5Mode为true，去掉url中的#
            $locationProvider.html5Mode(false);
            $urlRouterProvider
                .when('/', '/login')
                .when('/setting', '/setting/sweepgun')
                .when('/debug','/debug/optimallink')
                .otherwise('login');
        }
    ]);
