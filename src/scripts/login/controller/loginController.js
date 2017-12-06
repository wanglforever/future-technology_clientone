'use strict';
angular.module('iot-call.login')
    .controller('loginController', ['$scope', '$state', 'loginService', 'Ward', 'toast', 'userInfoService', '$timeout',
        function($scope, $state, loginService, Ward, toast, userInfoService, $timeout) {
            $scope.account = userInfoService.getLastLoginName();
            $scope.ward = new Ward();

            $scope.submit = function() {
                $scope.promise = loginService.login($scope.account.username, $scope.account.password)
                    .then(function() {
                        userInfoService.updateWardInfo($scope.ward.curWard.wardNo, $scope.ward.curWard.wardName);
                        $state.go('main.call');
                    }, function(resp) {
                        if (resp.status === 401) {
                            if (resp.data && resp.data.message === 'User is disabled') {
                                toast.error('该账号已禁用！');
                            } else {
                                toast.error('密码错误，请重新输入！');
                            }
                            document.getElementsByName('Password')[0].focus();
                            $scope.account.password = '';
                        } else {
                            toast.error('登录失败');
                        }
                    });
            };

            $scope.searchWardName = function() {
                loginService.getAllWardName($scope.account.username)
                    .then(function(result) {
                        if (result.data && result.data.length) {
                            $scope.ward.init(result.data);
                        } else {
                            $scope.ward.clearWard();
                        }
                    }, function() {
                        toast.error('登录失败');
                    });
            };

            var clickNum = 0;
            var clickClearTimeout = null;
            $scope.debug = function() {
                clickNum++;
                if (!clickClearTimeout) {
                    clickClearTimeout = $timeout(function() {
                        clickNum = 0;
                        clickClearTimeout = null;
                    }, 2000);
                }
                if (clickNum > 5) {
                    $timeout.cancel(clickClearTimeout);
                    clickNum = 0;
                    clickClearTimeout = null;
                    $state.go('debug.optimal');
                }
            };

            $scope.searchWardName();
        }
    ]);
