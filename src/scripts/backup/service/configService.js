'use strict';
angular.module('iot-call.backup')
    .service('configService', ['$http', '$q', 'serverUrl', function($http, $q, serverUrl) {
        var service = this;

        /**
         * 更新配置信息
         * @return {[type]} [description]
         */
        service.updateSetting = function(settingConfig) {
            return $http({
                method: 'post',
                url: serverUrl + '/v1/setting/update',
                data: settingConfig
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 查询配置信息
         * @return {[type]} [description]
         */
        service.querySetting = function() {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/setting/query'
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 解绑
         * @param  {[type]} staffId [description]
         * @param  {[type]} wardNo  [description]
         * @return {[type]}         [description]
         */
        service.unbundle = function(staffId, wardNo) {
            return $http({
                method: 'post',
                url: serverUrl + '/v1/scanner/unbundle',
                params: {
                    staffId: staffId,
                    wardNo: wardNo
                }
            }).then(function(result) {
                console.log(result);
                return result.data;
            }, function(error) {
                return error;
            });
        };


        /**
         * 查询绑定信息
         * @param  {[type]} wardNo [description]
         * @return {[type]}        [description]
         */
        service.queryBindInfos = function(wardNo) {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/scanner/bindInfos',
                params: {
                    wardNo: wardNo
                }
            }).then(function(result) {
                console.log(result);
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 获取所有公告列表
         */
        service.getNoticeList = function() {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/bulletin/allList'
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 添加notice
         * @param {[type]} notice [description]
         */
        service.addNotice = function(notice) {
            return $http({
                method: 'post',
                url: serverUrl + '/v1/bulletin/add',
                data: notice
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 删除notice
         * @param  {[type]} id [description]
         * @return {[type]}    [description]
         */
        service.delNotice = function(id) {
            return $http({
                method: 'delete',
                url: serverUrl + '/v1/bulletin/delete',
                params: {
                    id: id
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 更新列表顺序
         * @param  {[type]} notices [description]
         * @return {[type]}         [description]
         */
        service.updateNotices = function(notices) {
            return $http({
                method: 'put',
                url: serverUrl + '/v1/bulletin/order',
                data: notices
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };
    }]);
