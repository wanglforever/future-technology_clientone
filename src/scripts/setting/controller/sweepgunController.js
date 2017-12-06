'use strict';
angular.module('iot-call.call')
    .controller('sweepgunController', ['$scope', '$state', 'configService', 'userInfoService', 'toast',
        function($scope, $state, configService, userInfoService, toast) {
            $scope.bindTypes = [{
                type: -1,
                text: '全部'
            }, {
                type: 0,
                text: '未绑定'
            }, {
                type: 1,
                text: '已绑定'
            }];

            $scope.selected = {
                bindType: $scope.bindTypes[0],
                staff: {
                    id: '-1',
                    name: '全部'
                }
            };

            var wardNo = userInfoService.getWardNo();
            configService.queryBindInfos(wardNo).then(function(result) {
                $scope.bindInfos = result.data || [];
                initStaff($scope.bindInfos);
            });


            $scope.unbundle = function(staffId, isDisabled) {
                if (isDisabled) {
                    configService.unbundle(staffId, wardNo).then(function(result) {
                        if (result.status === 'SUCCESS') {
                            toast.success('解绑成功');
                        } else {
                            toast.error('解绑失败');
                        }
                    });
                }
            };

            function initStaff(result) {
                $scope.staffs = result.map(function(obj) {
                    return {
                        id: obj.staffId,
                        name: obj.staffName
                    };
                });
                $scope.staffs.unshift({
                    id: '-1',
                    name: '全部'
                });
            }
        }
    ]);
