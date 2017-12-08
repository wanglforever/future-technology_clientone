/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:15
 * Description:
 */
'use strict';
angular.module('main.operate',[])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main.operate', {
                url: '/operate',
                templateUrl: 'views/operate/operate.html',
                controller: 'operateController'
            })
            .state('main.operateAdd', {
                url: '/operateAdd',
                templateUrl: 'views/operate/operateAdd.html',
                controller: 'operateAddController'
            });
    }]);
