'use strict';
angular.module('iot-call.common')
    .directive('kyPagination', [function() {
        return {
            restrict: 'E',
            templateUrl: 'views/common/kyPagination.html',
            scope: {
                isDisabled: '=?',
                totalPages: '=',
                curPage: '=',
                updateFunc: '&',
                mini: '=',
                index: '=?'
            },
            link: function(scope) {
                //进行初始化,将显示的页数列表置空,设置同时最多显示5个页数
                scope.pages = [];
                scope.maxSize = 5;

                //显示页数的最小值,最大值,以及前后范围
                var min, max,
                    range = Math.floor(scope.maxSize / 2);

                //页数跳转的函数
                scope.go2Page = function(pageNum) {
                    if (pageNum >= 1 && pageNum <= scope.totalPages && pageNum !== scope.curPage && !scope.isDisabled) {
                        scope.curPage = pageNum;
                        update(true);
                    }
                };

                //直接跳转到指定页数
                scope.go2InputPageNum = function() {
                    var num = parseInt(scope.inputPageNum);
                    if (typeof num !== 'undefined' && !isNaN(num) && num !== scope.curPage) {
                        scope.go2Page(num);
                    }
                };

                //同步当前页数和输入框中的页数
                scope.$watch('curPage', function() {
                    scope.inputPageNum = scope.curPage;
                    update(false);
                });


                //总页数变化时, 执行更新操作
                scope.$watch('totalPages', function() {
                    if (typeof scope.totalPages !== 'undefined') {
                        update(false);
                    }
                });
                scope.cursorDisabled = {}
                scope.$watch('isDisabled', function() {
                    if (scope.isDisabled) {
                        scope.cursorDisabled = {
                            cursor: 'not-allowed',
                        };
                    } else {
                        scope.cursorDisabled = {};
                    }
                });

                //更新操作, 更新当前页数以及显示的页数范围
                function update(callFunc) {
                    //确定显示页数的最小值和最大值
                    min = Math.max(1, scope.curPage - range);
                    max = Math.min(scope.totalPages, scope.curPage + range);

                    if (min === 1) {
                        max = Math.max(max, min + range * 2);
                        scope.totalPages = Math.max(1, scope.totalPages);
                        max = Math.min(scope.totalPages, max);
                    }

                    if (max === scope.totalPages) {
                        min = Math.min(min, max - range * 2);
                        min = Math.max(1, min);
                    }

                    //确定是否要显示省略号
                    scope.frontEllipsis = min !== 1;
                    scope.endEllipsis = max !== scope.totalPages;

                    //更新页数范围
                    scope.pages = [];
                    for (var i = min; i <= max; i++) {
                        scope.pages.push(i);
                    }

                    //调用传递进来的更新函数
                    scope.inputPageNum = scope.curPage;
                    if (callFunc) {
                        scope.updateFunc({ num: scope.curPage, index: scope.index });
                        $('#paginationNum').blur();
                    }
                }
            }
        };

    }]);
