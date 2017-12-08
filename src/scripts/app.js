'use strict';
angular.module('udbs', [
        'ui.router',
        'udbs.common',
        'udbs.main',
        'udbs.login',
        'main.content',
        'main.operate',
        'ui.bootstrap.datetimepicker'
    ])
    .config(['$urlRouterProvider', '$locationProvider',
        function($urlRouterProvider, $locationProvider) {
            /*html5mode will be true, when release,
             this is auto build, don't need modify*/
            // 发布版本是html5Mode为true，去掉url中的#
            $locationProvider.html5Mode(false);
            $urlRouterProvider
                .when('/', '/login')
                .otherwise('login');
        }
    ]);
