'use strict';
angular.module('iot-call.main')
    .service('mainService',['$http','serverUrl',function($http,serverUrl){
        var service = this;
        
        /**
         * 获取全部医院信息
         * @returns {*}
         */
        service.getAllWardName = function () {
            
        };


    }]);

