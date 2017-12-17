'use strict';
angular.module('udbs.login')
    .controller('loginController', ['$scope', '$state', 'loginService', 'toast', 'userInfoService', '$timeout',
        function($scope, $state, loginService, toast, userInfoService, $timeout) {
            // $scope.account = userInfoService.getLastLoginName();

            $scope.submit = function() {
                $scope.promise = loginService.login($scope.account.username, $scope.account.password)
                    .then(function(resp) {
                        if(resp.accountRole == 'ROLE_ADMIN'){
                            $state.go('main.content');
                        }else{
                            toast.error("登录失败，重新登录")
                        }
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
        }
    ]);
