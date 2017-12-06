'use strict';
angular.module('iot-call.backup')
    .service('callService', ['$http', '$q', 'serverUrl', function($http, $q, serverUrl) {
        var service = this;

        service.getNursesAndPatients = function(wardNo) {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/nameplate/nurse',
                params: {
                    'wardNo': wardNo
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.getCallBeds = function(wardNo) {
            return $http({
                method: 'get',
                url: serverUrl + '/v1/nameplate/allCallBeds',
                params: {
                    'wardNo': wardNo
                }
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };

        service.answerCall = function(bedInfo) {
            return $http({
                method: 'post',
                url: serverUrl + '/v1/nameplate/answer',
                data: bedInfo
            }).then(function(result) {
                return result.data;
            }, function(error) {
                return error;
            });
        };
    }]);
