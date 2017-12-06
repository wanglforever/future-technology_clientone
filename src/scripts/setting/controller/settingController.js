'use strict';
angular.module('iot-call.call')
    .controller('settingController', ['$scope', '$state',
        function($scope, $state) {

            $scope.menus = [{
                state: 'main.setting.sweepgun',
                name: '扫码枪设置',
                isSelected: false
            }, {
                state: 'main.setting.common',
                name: '通用设置',
                isSelected: false
            }, {
                state: 'main.setting.notice',
                name: '公告设置',
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
        }
    ]);
