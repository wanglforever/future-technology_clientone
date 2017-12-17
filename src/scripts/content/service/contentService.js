/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:21
 * Description:
 */
'use strict';
angular.module('main.content')
.service('contentService',['$http','$q','serverUrl','userInfoService',function ($http,$q,serverUrl,userInfoService) {

    var service = this;

    service.saveContent = function (content) {
        return $http({
            method: 'POST',
            url: serverUrl + '/essay/save',
            data:content
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    };

    service.editContent = function (content) {
        return $http({
            method: 'PUT',
            url: serverUrl + '/essay/editor',
            data:content
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    };

    service.queryContent = function (searchParam) {
        return $http({
            method: 'POST',
            url: serverUrl + '/essay/query',
            data:searchParam
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    };

    service.delete = function (id) {
        return $http({
            method: 'DELETE',
            url: serverUrl + '/essay/delete',
            params:{
                id:id
            }
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    };

    service.batchDelete = function (idList) {
        return $http({
            method: 'DELETE',
            url: serverUrl + '/essay/batchDelete',
            params:{
                idList:idList
            }
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    };

    service.changeStatus = function (id) {
        return $http({
            method: 'PUT',
            url: serverUrl + '/essay/downline',
            params:{
                id:id
            }
        }).then(function(result) {
            return result.data;
        }, function(error) {
            return error;
        });
    }

}]);
