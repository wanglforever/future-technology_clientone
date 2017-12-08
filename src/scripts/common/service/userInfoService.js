'use strict';
angular.module('udbs.common')
    .service('userInfoService', ['$localStorage', function($localStorage) {
        var service = this;

        service.setUserInfo = function(userInfo) {
            $localStorage.userInfo = angular.copy(userInfo, {});
        };
        service.getUserInfo = function() {
            return $localStorage.userInfo;
        };
        service.clearUserInfo = function() {
            delete $localStorage.userInfo;
        };

        service.updateWardInfo = function(wardNo, wardName) {
            $localStorage.userInfo.wardNo = wardNo;
            $localStorage.userInfo.wardName = wardName;
        };

        //获取用户的医院ID
        service.getWardNo = function() {
            return $localStorage.userInfo.wardNo;
        };

        //获取用户的ID
        service.getUserId = function() {
            return $localStorage.userInfo.userId;
        };

        /**
         * 获取role Ids
         */
        service.getRoleIds = function() {
            var ids = [];
            $localStorage.userInfo.authorities.forEach(function(item) {
                ids.push(item.authority);
            });
            return ids;
        };

        //上次登录的用户名
        service.getLastLoginName = function() {
            return {
                username: $localStorage.lastLoginInfo ? $localStorage.lastLoginInfo.username : '',
                password: ''
            };
        };

        service.getLastLoginInfo = function() {
            return $localStorage.lastLoginInfo;
        };

        //记住当前登录名，以便下次登录时自动填充用户名
        service.setLastLoginInfo = function(username, password) {
            $localStorage.lastLoginInfo = { username: username, password: password };
        };

    }]);
