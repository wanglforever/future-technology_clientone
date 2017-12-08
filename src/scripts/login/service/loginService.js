/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/6
 * Time: 20:32
 * Description:
 */
'use strict';
angular.module('udbs.login')
.service('loginService',['$http','$q','serverUrl','userInfoService',function ($http,$q,serverUrl,userInfoService) {

    var service = this;
    var tokenPrefix = 'Basic ';


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

    function generateToken(username, password) {
        return tokenPrefix + btoa(username + ':' + password);
    }

}]);
