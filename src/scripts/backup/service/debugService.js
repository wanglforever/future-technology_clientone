'use strict';
angular.module('iot-call.backup')
    .service('debugService', ['$http', '$q', 'serverUrl', function($http, $q, serverUrl) {
        var service = this;

        /**
         * 获取最佳链路
         * @param  {[type]} page     [description]
         * @param  {[type]} pageSize [description]
         * @param  {[type]} wardNo   病区筛选，无则全部
         * @param  {[type]} scanner  扫描枪筛选，无则全部
         * @return {[type]}          [description]
         */
        service.getRoutes = function(page, pageSize, wardNo, scanner) {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/routers',
                params: {
                    'num': page,
                    'size': pageSize,
                    'wardNo': wardNo || '',
                    'scanner': scanner || ''
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.getAllWardList = function() {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/wardlist'
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };
    }]);
