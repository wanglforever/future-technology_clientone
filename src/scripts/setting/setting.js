'use strict';
angular.module('iot-call.setting', [])
    .config(['$stateProvider', function($stateProvider){
        $stateProvider
            .state('main.setting', {
                url: '/setting',
                abstract: true,
                views: {
                    '': {
                        templateUrl: 'views/setting/setting.html',
                        controller: 'settingController'
                    }
                }
            })
            .state('main.setting.sweepgun', {
                url: '/sweepgun',
                views: {
                    '': {
                        templateUrl: 'views/setting/sweepgun.html',
                        controller: 'sweepgunController'
                    }
                }
            })
            .state('main.setting.common', {
                url: '/common',
                views: {
                    '': {
                        templateUrl: 'views/setting/commonsetting.html',
                        controller: 'commonsettingController'
                    }
                }
            })
            .state('main.setting.notice', {
                url: '/notice',
                views: {
                    '': {
                        templateUrl: 'views/setting/noticesetting.html',
                        controller: 'noticesettingController'
                    }
                }
            });
    }]);
