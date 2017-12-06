'use strict';
angular.module('iot-call.call')
    .controller('commonsettingController', ['$scope', '$state', '$timeout', 'configService',
        function($scope, $state, $timeout, configService) {
            $scope.settingConfig = {
                callSwitch: '1',
                callType: '呼叫全病区',
                hideSwitch: '1',
                hideType: '前中隐藏',
            };

            $scope.callTypes = [{
                text: '仅呼叫责任护士',
                value: '仅呼叫责任护士',
                desp: '（点选后，仅限于患者的责任护士扫码枪响应）',
                type: 'callType',
                isSelected: false
            }, {
                text: '全病区呼叫',
                value: '呼叫全病区',
                desp: '（点选后，全病区护士扫码枪响应）',
                type: 'callType',
                isSelected: true
            }];

            $scope.hideTypes = [{
                text: '前中隐藏',
                value: '前中隐藏',
                desp: '（张三－＊三，张大牛－张＊牛，欧阳小鱼－＊＊小鱼）',
                type: 'hideType',
                isSelected: true
            }, {
                text: '中后隐藏',
                value: '中后隐藏',
                desp: '（张三－张＊，张大牛－张＊牛，欧阳小鱼－欧阳＊＊）',
                type: 'hideType',
                isSelected: false
            }];

            $scope.switchAnimated = false;
            configService.querySetting().then(function(result) {
                $scope.settingConfig = result.data;
                initTypes(result.data);
                $timeout(function() {
                    $scope.switchAnimated = true;
                });
            });

            $scope.saveConfig = function() {
                configService.updateSetting($scope.settingConfig);
            };

            $scope.selectType = function(typeObjs, type, value) {
                initSelectType(typeObjs, type, value, function() {
                    $scope.settingConfig[type] = value;
                });
                $scope.saveConfig();
            };

            function initTypes(result) {
                initSelectType($scope.callTypes, 'callType', result.callType);
                initSelectType($scope.hideTypes, 'hideType', result.hideType);
            }

            function initSelectType(typeObjs, type, value, callBack) {
                for (var i = 0; i < typeObjs.length; i++) {
                    var tmpType = typeObjs[i];
                    if (value === tmpType.value) {
                        tmpType.isSelected = true;
                        if (callBack) {
                            callBack(typeObjs, type, value);
                        }
                    } else {
                        tmpType.isSelected = false;
                    }
                }
            }
        }
    ]);
