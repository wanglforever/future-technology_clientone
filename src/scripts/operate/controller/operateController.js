/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:19
 * Description:
 */
'use strict';
angular.module('main.operate')
    .controller('operateController',['$scope', '$state',function ($scope,$state) {

        $scope.batchId = [];
        $scope.operateList = [];

        $scope.selectAll = function () {
            if ($scope.operateList.length !== $scope.batchId.length){
                $scope.batchId = [];
                angular.forEach($scope.operateList,function (item) {
                    item.isSelected = true;
                    $scope.batchId.push(item.essay_id);
                })
            }else{
                angular.forEach($scope.operateList,function (item) {
                    item.isSelected = false;
                });
                $scope.batchId = [];
            }
        };

        $scope.isSelectAll = function(){
            return $scope.operateList.length !== 0 && $scope.operateList.length === $scope.batchId.length;
        };

        $scope.select = function (id) {
            var i,j;
            for (i=0;i<$scope.operateList.length;i++){
                if($scope.operateList[i].essay_id == id){
                    $scope.operateList[i].isSelected = !$scope.operateList[i].isSelected;
                    if ($scope.operateList[i].isSelected){
                        $scope.batchId.push(id);
                    }else{
                        for (j=0;j<$scope.batchId.length;j++){
                            if ($scope.batchId[j] == id){
                                $scope.batchId.splice(j--,1)
                            }
                        }
                    }
                }
            }
        };

    }]);
