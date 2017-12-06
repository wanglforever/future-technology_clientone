'use strict';
angular.module('iot-call.debug')
    .controller('debugController', ['$scope', function($scope) {
        $scope.menus = [{
            state: 'debug.optimal',
            name: '最优链路调试',
            isSelected: false
        }];
        $scope.selectMenu = function(state) {
            for (var i = 0; i < $scope.menus.length; i++) {
                var tmpMenu = $scope.menus[i];
                if (tmpMenu.state === state) {
                    tmpMenu.isSelected = true;
                } else {
                    tmpMenu.isSelected = false;
                }
            }
        };

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $scope.selectMenu(toState.name);
        });
    }]);
