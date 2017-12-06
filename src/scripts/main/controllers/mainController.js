'use strict';
angular.module('iot-call.main')
    .controller('mainController', ['$scope', '$state', 'userInfoService',
        function($scope, $state, userInfoService) {
            $scope.exit = function() {
                userInfoService.clearUserInfo();
                $state.go('login');
            };
            $scope.userInfo = userInfoService.getUserInfo();
        }
    ]);
