'use strict';
angular.module('udbs.main')
    .controller('mainController', ['$scope', '$state', 'userInfoService','$localStorage',
        function($scope, $state, userInfoService,$localStorage) {

        $scope.contentIsShow = false;
        $scope.operateIsShow = false;

        $scope.changeContent = function () {
            $scope.contentIsShow = !$scope.contentIsShow;
        };

        $scope.changeOperate = function () {
            $scope.operateIsShow = !$scope.operateIsShow;
        };

        $scope.changeState = function (id) {
            if (id == 1){
                $state.go('main.content');
            }else if (id == 2){
                $localStorage.contentEdit = false;
                $localStorage.content = {};
                $state.go('main.contentAdd');
            }else if (id == 3){
                $state.go('main.operate');
            }else if (id == 4){
                $localStorage.operateEdit = false;
                $localStorage.operate = {};
                $state.go('main.operateAdd');
            }
        };

        $scope.userInfo = userInfoService.getUserInfo();

        $scope.exit = function () {
            $state.go('login');
        };
        }
    ]);
