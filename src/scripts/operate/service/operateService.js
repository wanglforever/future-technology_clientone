/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:20
 * Description:
 */
'use strict';
angular.module('main.operate')
    .service('operateService',['$http','$q','serverUrl','Upload',function ($http,$q,serverUrl,Upload) {

        var service = this;

        //上传文件
        service.uploadfile = function (file) {
            return Upload.upload({
                url: serverUrl + '/banner/upload',
                method: 'POST',
                data: {
                    file:file
                },
                arrayKey: ''
            }).then(function (resp) {
                return resp.data;
            });
        };

        service.save = function (banner) {
            return $http({
                method: 'POST',
                url: serverUrl + '/banner/save',
                data:banner
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.edit = function (banner) {
            return $http({
                method: 'POST',
                url: serverUrl + '/banner/editor',
                data:banner
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.delete = function (bannerId) {
            return $http({
                method: 'DELETE',
                url: serverUrl + '/banner/delete',
                params:{
                    bannerId:bannerId
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.batchDelete = function (bannerIdList) {
            return $http({
                method: 'DELETE',
                url: serverUrl + '/banner/bathDelete',
                params:{
                    bannerIdList:bannerIdList
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.query = function (queryInfo) {
            return $http({
                method: 'POST',
                url: serverUrl + '/banner/query',
                data:queryInfo
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.downline = function (bannerId) {
            return $http({
                method: 'PUT',
                url: serverUrl + '/banner/downline',
                params:{
                    bannerId:bannerId
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

    }]);
