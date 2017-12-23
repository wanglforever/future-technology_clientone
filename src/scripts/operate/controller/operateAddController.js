/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:19
 * Description:
 */
'use strict';
angular.module('main.operate')
    .controller('operateAddController',['$scope', '$state','operateService','toast',function ($scope,$state,operateService,toast) {


        $scope.bannerStatus = 1;
        $scope.operatePositionList = [
            '首页大图滚动位置1',
            '首页大图滚动位置2',
            '首页大图滚动位置3',
            '首页小图固定位置1',
            '首页小图固定位置2',
            '首页小图固定位置3',
            '首页小图固定位置4'
        ];
        $scope.operatePositionMap = {
            '首页大图滚动位置1':1,
            '首页大图滚动位置2':2,
            '首页大图滚动位置3':3,
            '首页小图固定位置1':4,
            '首页小图固定位置2':5,
            '首页小图固定位置3':6,
            '首页小图固定位置4':7
        };
        $scope.isUploading = false;
        $scope.isShowDefault = true;

        $scope.uploadOperate = function (file) {
            $scope.isUploading = true;
            $scope.isShowDefault = false;
            operateService.uploadfile(file).then(function (resp) {
                $scope.isUploading = false;
                $scope.fileUrl = resp.data[0];
            })
        };

        $scope.changeSelected = function (id) {
            $scope.bannerStatus = id;
            $scope.enabled = id === 0;
        };

        $scope.save = function () {
            $scope.nameIsNull = $scope.bannerName == null;
            if($scope.nameIsNull){
                return;
            }
            $scope.optionIsNull = $scope.bannerPosition == null;
            if ($scope.optionIsNull){
                return;
            }
            $scope.checkFail = $scope.bannerRef == null;
            if ($scope.checkFail){
                return;
            }else{
                $.ajax({
                    url: $scope.bannerRef,
                    type: 'GET',
                    dataType: "jsonp",
                    complete: function(response) {
                        if(response.status == 200) {
                            $scope.checkFail = false;
                            $scope.fileIsNull = $scope.fileUrl == null;
                            if ($scope.fileIsNull){
                                return;
                            }
                            //前面都是校验，这里是真正保存
                            $scope.saveData();
                        } else {
                            $scope.checkFail = true;
                        }
                    }
                });

            }
        };

        $scope.saveData = function () {
            var banner = {
                banner_name:$scope.bannerName,
                banner_title:$scope.bannerTitle,
                banner_content:$scope.bannerContent,
                banner_description:$scope.bannerDescription,
                banner_source:$scope.fileUrl,
                ref_address:$scope.bannerRef,
                bposition_id:$scope.operatePositionMap[$scope.bannerPosition],
                bstatus_id:$scope.bannerStatus
            };
            operateService.save(banner).then(function (resp) {
                if (resp.status == 'SUCCESS'){
                    $state.go('main.operate');
                }else{
                    toast.error(resp.message);
                }
            })
        };

        $scope.cancel = function () {
            $state.go('main.operate');
        }
    }]);
