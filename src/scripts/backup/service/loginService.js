'use strict';
angular.module('iot-call.backup')
    .service('loginService', ['$http', '$q', 'userInfoService', 'serverUrl', function($http, $q, userInfoService, serverUrl) {
        var service = this;
        var tokenPrefix = 'Basic '; //token 前缀

        /**
         * 登录
         * @param  {[type]} userName [description]
         * @param  {[type]} password [description]
         * @return {[type]}          [description]
         */
        service.login = function(userName, password) {
            var token = generateToken(userName, password);
            return $http({
                method: 'get',
                url: serverUrl + '/user',
                headers: {
                    'Authorization': token
                }
            }).then(function(result) {
                userInfoService.setUserInfo(result.data);
                userInfoService.setLastLoginInfo(userName, password);
                return result.data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 获取全部医院信息
         * @returns {*}
         */
        service.getAllWardName = function(value) {
            return $http({
                method: 'GET',
                url: serverUrl + '/wardNames',
                params: {
                    userName: value
                }
            }).then(function(data) {
                return data;
            }, function(error) {
                return error;
            });
        };

        /**
         * 生成token
         * @param  {[String]} username 用户名
         * @param  {[String]} password 密码
         * @return {[String]}         token
         */
        function generateToken(username, password) {
            return tokenPrefix + btoa(username + ':' + password);
        }
    }]);
