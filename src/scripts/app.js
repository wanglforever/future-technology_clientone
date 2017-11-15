'use strict';
angular.module('udbs',['ui.router'])
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
    $urlRouterProvider.otherwise('/home') ;
    $locationProvider.html5Mode(true);

    $stateProvider
        .state('home',{
            url: '/home',
            templateUrl:'views/partial-home.html'
        })
        // home.list符合惯例
        .state('list', {
            url: '/list',
            templateUrl: 'views/partial-home-list.html',
            controller: function($scope) {
                $scope.dogs = ['Bernese', 'Husky', 'Goldendoodle'];
            }
        })

        // home.paragraph符合惯例
        .state('home.paragraph', {
            url: '/paragraph',
            template: 'I could sure use a drink right now.'
        })
        .state('about', {
            url: '/about',
            views: { //是指ng-view

                // 模板
                '': { templateUrl: 'views/partial-about.html' },

                // 名称为columnOne的ng-view,viewName@stateName
                'columnOne@about': { template: 'Look I am a column!' },

                // 名称为columnTow的ng-view,viewName@stateName
                'columnTwo@about': {
                    templateUrl: 'views/table-data.html',
                    controller: 'SecondController'
                }
            }

        });


})
    .controller('SecondController', function($scope) {

        $scope.message = 'test';

        $scope.products = [
            {
                name: 'Macallan 12',
                price: 50
            },
            {
                name: 'Chivas Regal Royal Salute',
                price: 10000
            },
            {
                name: 'Glenfiddich 1937',
                price: 20000
            }
        ];
    });;
