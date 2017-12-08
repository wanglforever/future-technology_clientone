/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:21
 * Description:
 */
'use strict';
angular.module('main.content')
.controller('contentController',['$scope', '$state',function ($scope,$state) {

    $scope.startTimeShow = false;

    $scope.changeStartTimeShow = function () {
        $scope.startTimeShow = !$scope.startTimeShow;
    };

    $scope.$watch('startTime', function() {
        $scope.startTimeShow = false;
    });

}]);
