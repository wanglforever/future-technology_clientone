'use strict';
angular.module('udbs.common')
    .filter('timeFormat', function() {
        var filter = function(input) {
            var times = input.split(':');
            times.pop();
            return times.join(':');
        };
        return filter;
    })
    .filter('timeFormatCN', function() {
        var filter = function(input) {
            var times = input.split(':');
            var curTime = new Date();
            var curHour = curTime.getHours();
            var curMinute = curTime.getMinutes();
            var hour = times[0];
            var minute = times[1];

            if (curHour - hour > 0 || curMinute - minute < 0) {
                times.pop();
                return times.join(':');
            } else {
                return (curMinute - minute) + '分钟前';
            }
        };
        return filter;
    });
