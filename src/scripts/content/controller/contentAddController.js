/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:21
 * Description:
 */
'use strict';
angular.module('main.content')
    .controller('contentAddController',['$scope', '$state','serverUrl','contentService','$localStorage',function ($scope,$state,serverUrl,contentService,$localStorage) {

        var content = $localStorage.content;
        $scope.selected = true;
        $scope.contentTypeList = ['资讯动态','公告信息'];
        $scope.contentStatus = 0;
        $scope.contentTypeMap = {
            '资讯动态':1,
            '公告信息':2
        };
        $scope.isDuplicateName = false;
        var E = window.wangEditor;
        var editor = new E('#editor');


        editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'undo',  // 撤销
            'redo'  // 重复
        ];
        editor.customConfig.uploadFileName = 'file';
        editor.customConfig.uploadImgTimeout = 60000;
        editor.customConfig.uploadImgServer = serverUrl+ '/essay/upload';

        editor.create();

        $scope.changeSelected = function (id) {
            $scope.contentStatus = id;
            $scope.selected = !$scope.selected;
        };

        $scope.save = function () {
            if ($scope.contentType == null){
                $scope.typeIsNull = true;
                return;
            }
            $scope.typeIsNull = false;
            if( $scope.contentTitle==null ){
                $scope.isDuplicateName = true;
                $scope.errorMessage = '标题不能为空';
                return;
            }
            var tmpContent = {
                essay_title:$scope.contentTitle,
                catogory_id:$scope.contentTypeMap[$scope.contentType],
                status_id:$scope.contentStatus,
                essay_content:editor.txt.html()
            };
            if ($localStorage.contentEdit){
                tmpContent.essay_id = content.essay_id;
                contentService.editContent(tmpContent).then(function (resp) {
                    if (resp.status == 'SUCCESS'){
                        $state.go('main.content');
                    }else {
                        if (resp.businessCode == '_u_003'){
                            $scope.isDuplicateName = true;
                            $scope.errorMessage = resp.message;
                        }
                    }
                });
            }else{
                contentService.saveContent(tmpContent).then(function (resp) {
                    if (resp.status == 'SUCCESS'){
                        $state.go('main.content');
                    }else {
                        if (resp.businessCode == '_s_001'){
                            $scope.isDuplicateName = true;
                            $scope.errorMessage = resp.message;
                        }
                    }
                })
            }
        };



        $scope.initData = function () {
            if ($localStorage.contentEdit){
                $scope.contentType = content.catogory_name;
                $scope.contentTitle = content.essay_title;
                if (content.status_name == '已上线'){
                    $scope.contentStatus = 0;
                    $scope.selected = true;
                }else{
                    $scope.contentStatus = 1;
                    $scope.selected = false;
                }
                editor.txt.html(content.essay_content);
            }
        };

        $scope.initData();

        $scope.cancel = function () {
            $state.go('main.content');
        }

}]);
