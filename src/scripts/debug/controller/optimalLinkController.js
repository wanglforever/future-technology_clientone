'use strict';
angular.module('iot-call.debug')
    .controller('optimalLinkController', ['$scope', 'debugService', function($scope, debugService) {

        var pageSize = 10;

        var defaultWard = {
            wardNo: '',
            wardName: '全部',
        };
        var defaultScanner = '全部';

        $scope.wardList = [defaultWard];
        $scope.scannerList = [defaultScanner];
        $scope.selected = {
            ward: defaultWard,
            scanner: defaultScanner
        };
        $scope.routes = [];
        $scope.page = {
            curPage: 1,
            pages: 1,
            pageSize: pageSize
        };

        getRoutes();

        debugService.getAllWardList().then(function(result) {
            $scope.wardList = $scope.wardList.concat(result.data.wardInfos);
            $scope.scannerList = $scope.scannerList.concat(result.data.scannerList);
        });

        $scope.refresh = function() {
            getRoutes();
        };

        $scope.getRoutes = getRoutes;

        function getRoutes(num) {
            debugService.getRoutes(num || 1, pageSize, $scope.selected.ward.wardNo,
                    $scope.selected.scanner === defaultScanner ? '' : $scope.selected.scanner)
                .then(function(result) {
                    if (!num) {
                        $scope.page.curPage = 1;
                    }
                    $scope.page.pages = Math.ceil(result.data.count / pageSize);
                    $scope.routes = result.data.routerList;
                });
        }

        $scope.getWardName = function(wardNo) {
            for (var key in $scope.wardList) {
                if ($scope.wardList[key].wardNo === wardNo) {
                    return $scope.wardList[key].wardName;
                }
            }
        };
    }]);
