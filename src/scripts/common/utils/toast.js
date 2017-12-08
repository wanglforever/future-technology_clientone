'use strict';
/**
 * @author Huis
 * 创建时间： 2016-10-10 09:29:21
 * 创建任务号：无
 * 创建原因：对toastr进一步封装
 * 参考路径：https://github.com/Foxandxss/angular-toastr
 */
angular.module('udbs.common')
    .config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            positionClass: 'toast-top-center',
            preventOpenDuplicates: true,
            maxOpened: 3,
            toastClass: 'toast',
            timeOut: 3000,
            extendedTimeOut: 0
        });
    })
    .factory('toast', ['toastr', 'toastrConfig', function(toastr, toastrConfig) {
        function securitifyConfig(config) {
            if (!config) {
                config = {};
            } else {
                angular.extend(toastrConfig, config);
            }
            config.title = config.title || '';
            return config;
        }
        return {
            toast: function(message, type, config) {
                type = type || 'success';
                var execFn = toastr[type];
                if (angular.isFunction(execFn)) {
                    config = securitifyConfig(config);
                    return execFn(message, config.title, config);
                } else {
                    return null;
                }
            },

            /**
             * Success Toast
             * 具体参见toast
             */
            success: function(message, config) {
                return this.toast(message, 'success', config);
            },

            /**
             * Info Toast
             * 具体参见toast
             */
            info: function(message, config) {
                return this.toast(message, 'info', config);
            },

            /**
             * Error Toast
             * 具体参见toast
             */
            error: function(message, config) {
                return this.toast(message, 'error', config);
            },

            /**
             * Warning Toast
             * 具体参见toast
             */
            warning: function(message, config) {
                return this.toast(message, 'warning', config);
            },

            /**
             * 返回当前现实toast的个数
             * @return {[Number]} 个数
             */
            active: function() {
                return toastr.active();
            },

            /**
             * 清除toast
             * @param  {[Toast]} toast 如果不指定toast,则清除当前全部显示的toast
             */
            clear: function(toast) {
                if (!toast) {
                    toastr.clear();
                } else {
                    toastr.clear(toast);
                }
            },

            /**
             * 移除toast
             * @param  {[Toast]} toast     要移除的Toast对象
             * @param  {[Boolean]} wasClicked 是否是鼠标点击
             */
            remove: function(toast, wasClicked) {
                toastr.remove(toast.toastId, wasClicked);
            }
        };
    }]);
