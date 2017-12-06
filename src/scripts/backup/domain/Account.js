/**
 * @author fangxinhe 2017/3/27
 * 登录账号信息相关
 */
'use strict';
angular.module('iot-call.backup')
    .factory('Account', ['userBaseInfoService',function (userBaseInfoService) {
        function Account(){
            //登录用户名
            this.username = '';
            //密码
            this.password = '';
        }

        /**
         * 清理用户名和密码
         * @param filedName
         */
        Account.prototype.clearAccount = function(filedName){
            if(filedName){
                this[filedName] = '';
            }else{
                this.username = '';
                this.password = '';
            }
        };

        /**
         * 初始化账号
         */
        Account.prototype.initUserName = function(){
           var info =  userBaseInfoService.getLastLoginInfo() || {};
            this.username = info.username || '';
            this.password = '';
        };

        /**
         * 保存账号登录信息
         */
        Account.prototype.saveUserName = function(){
            userBaseInfoService.setLastLoginInfo({username: this.username});
        };

        /**
         * 字段是否为空
         * @param filedName
         * @returns {boolean}
         */
        Account.prototype.isEmpty = function(filedName){
            return typeof this[filedName] === 'undefined' ||  this[filedName]=== "" || this[filedName]=== null;
        };

        /**
         * 当前账号是否是admin
         * @returns {boolean}
         */
        Account.prototype.isAdmin = function(){
            return this.username.toLowerCase() === 'admin';
        };

        /**
         * 获取当前年份
         * @returns {string}
         */
        Account.prototype.getYear = function () {
            return moment().format('YYYY');
        };

        return Account;
    }]);
