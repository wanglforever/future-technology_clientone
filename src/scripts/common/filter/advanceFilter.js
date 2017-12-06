'use strict';
angular.module('iot-call.common')
    .filter('advanceFilter', function() {
        var filter = function(input, staffName, bindType) {
            if (!input) {
                return input;
            }
            var params = {
                'staffName': staffName,
                'bindType': bindType
            };
            return input.filter(function(obj) {
                if (checkParams(obj, params)) {
                    return true;
                }
                return false;
            });
        };

        function checkParams(obj, params) {
            var result = true;
            for (var key in params) {
                if (key === 'staffName') {
                    if (params[key] !== '全部' && obj[key] !== params[key]) {
                        result = false;
                    }
                } else if (key === 'bindType') {
                    var relType = obj.scannerGunId ? 1 : 0;
                    if (params[key] !== -1 && relType !== params[key]) {
                        result = false;
                    }
                }
            }
            return result;
        }

        return filter;
    });
