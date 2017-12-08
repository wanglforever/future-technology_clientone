/**
 * Created with IntelliJ IDEA.
 * User: wangl
 * Date: 2017/12/7
 * Time: 22:16
 * Description:
 */
'use strict';
angular.module('main.content',[])
    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state('main.content', {
                url: '/content',
                templateUrl: 'views/content/content.html',
                controller: 'contentController'
            })
            .state('main.contentAdd',{
                url:'/contentAdd',
                templateUrl: 'views/content/contentAdd.html',
                controller: 'contentAddController'
            })
    }]);
