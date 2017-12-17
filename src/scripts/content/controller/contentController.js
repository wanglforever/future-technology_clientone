/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:21
 * Description:
 */
'use strict';
angular.module('main.content')
.controller('contentController',['$scope', '$state','contentService','$localStorage',function ($scope,$state,contentService,$localStorage) {

    $scope.startTimeShow = false;
    $scope.endTimeShow = false;
    $scope.contentTypeList = ['资讯动态','公告信息'];
    $scope.contentStatusList = ['已上线','已下线'];
    $scope.contentList = [];
    $scope.batchId = [];

    $scope.changeStartTimeShow = function () {
        $scope.startTimeShow = !$scope.startTimeShow;
    };

    $scope.changeEndTimeShow = function () {
        $scope.endTimeShow = !$scope.endTimeShow;
    };

    $scope.$watch('startTime', function() {
        $scope.startTimeShow = false;
    });

    $scope.$watch('endTime', function() {
        $scope.endTimeShow = false;
    });

    $scope.selectAll = function () {
        if ($scope.contentList.length !== $scope.batchId.length){
            $scope.batchId = [];
            angular.forEach($scope.contentList,function (item) {
                item.isSelected = true;
                $scope.batchId.push(item.essay_id);
            })
        }else{
            angular.forEach($scope.contentList,function (item) {
                item.isSelected = false;
            });
            $scope.batchId = [];
        }
    };

    $scope.isSelectAll = function(){
        return $scope.contentList.length !== 0 && $scope.contentList.length === $scope.batchId.length;
    };

    $scope.queryContentList = function (curPage) {
        var typeMap = {
            '资讯动态':1,
            '公告信息':2
        };
        var statusMap = {
            '已上线':0,
            '已下线':1
        };
        var startTime = $scope.startTime != null?moment($scope.startTime).format('YYYY-MM-DD HH:mm:ss'):null;
        var endTime = $scope.endTime != null?moment($scope.endTime).format('YYYY-MM-DD HH:mm:ss'):null;
        var searchParam = {
            start_time:startTime,
            end_time:endTime,
            catogory_id:typeMap[$scope.contentType],
            status_id:statusMap[$scope.contentStatus],
            essay_title:$scope.contentTitle,
            currentPage:curPage
        };
        contentService.queryContent(searchParam).then(function (resp) {
            if(resp.data != null){
                $scope.contentList = resp.data.infoList;
            }else{
                $scope.contentList = [];
            }
            $scope.pageParam = resp.data;
        })
    };

    $scope.refreshList = function (curPage) {
        $scope.queryContentList(curPage);
    };

    $scope.queryContentList();

    $scope.batchDelete = function () {
        contentService.batchDelete($scope.batchId).then(function (resp) {
            $scope.queryContentList();
        })
    };

    $scope.select = function (id) {
        var i,j;
        for (i=0;i<$scope.contentList.length;i++){
            if($scope.contentList[i].essay_id == id){
                $scope.contentList[i].isSelected = !$scope.contentList[i].isSelected;
                if ($scope.contentList[i].isSelected){
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

    $scope.edit = function (index) {
        $localStorage.contentEdit = true;
        $localStorage.content = $scope.contentList[index];
        $state.go('main.contentAdd');
    };

    $scope.online = function (id) {
        contentService.changeStatus(id).then(function (resp) {
            $scope.queryContentList();
        })
    };

    $scope.offline = function (id) {
        contentService.changeStatus(id).then(function (resp) {
            $scope.queryContentList();
        })
    };

    $scope.delete = function (id) {
        contentService.delete(id).then(function (resp) {
            $scope.queryContentList();
        })
    }
}]);
