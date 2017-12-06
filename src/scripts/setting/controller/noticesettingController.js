'use strict';
angular.module('iot-call.call')
    .controller('noticesettingController', ['$scope', '$state', '$timeout', 'configService', 'toast',
        function($scope, $state, $timeout, configService, toast) {

            $scope.noticeList = [];
            $scope.sortableOptions = {
                disabled: true,
                axis: 'y',
                isChange: false,
                update: function() {
                    $scope.sortableOptions.isChange = true;
                },
                handle: '.myHandle',
                items: '.sortable'
            };

            $scope.showAddModel = function() {
                $scope.addNoticeContent = '';
            };

            $scope.toggleSelect = function(notice) {
                notice.isShow = notice.isShow ? 0 : 1;
                updateOrders();
                configService.updateNotices($scope.noticeList).then(function(result) {
                    showResultToast(result);
                    getAllNotices();
                });
            };

            $scope.toggleSort = function() {
                $scope.isSort = !$scope.isSort;
                $scope.sortableOptions.disabled = !$scope.sortableOptions.disabled;
                if (!$scope.isSort && $scope.sortableOptions.isChange) {
                    saveOrders();
                }
            };

            $scope.addNotice = function() {
                var error = validInput();
                if (!error) {
                    var notice = {
                        content: $scope.addNoticeContent,
                        orderNum: $scope.noticeList.length + 1
                    };
                    configService.addNotice(notice).then(function(result) {
                        showResultToast(result);
                        getAllNotices();
                        $('.add-notice').modal('hide');
                    });
                } else {
                    toast.error(error);
                }

            };

            $scope.delNotice = function(noticeId, index) {
                configService.delNotice(noticeId).then(function(result) {
                    showResultToast(result);
                    $scope.noticeList.splice(index, 1);
                });
            };

            $scope.$watch('addNoticeContent', function(newVal, oldVal) {
                if (newVal && newVal.length > 62) {
                    $scope.addNoticeContent = oldVal;
                }
            });

            getAllNotices();

            function getAllNotices() {
                configService.getNoticeList().then(function(result) {
                    $scope.noticeList = result.data;
                }, function(error) {
                    console.log(error);
                });
            }

            function showResultToast(result, msg, type) {
                type = type || 'info';
                msg = msg || result.message;
                if (type === 'info' && result.status === 'SUCCESS') {
                    toast.info(msg);
                } else if (type === 'error' && result.status === 'ERROR') {
                    toast.error(msg);
                }
            }

            function validInput() {
                var error = '';
                if ($scope.addNoticeContent.trim().length < 1) {
                    error = '内容不能为空';
                }
                return error;
            }

            function updateOrders() {
                for (var i = 0; i < $scope.noticeList.length; i++) {
                    $scope.noticeList[i].orderNum = i + 1;
                }
            }

            function saveOrders() {
                updateOrders();
                configService.updateNotices($scope.noticeList).then(function(result) {
                    showResultToast(result);
                });
            }
        }
    ]);
