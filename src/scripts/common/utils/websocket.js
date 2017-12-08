'use strict';
angular.module('udbs.common')
    .factory('webSocket', function($stomp, serverUrl) {
        function connect(connectCallback, errorCallback) {
            $stomp.connect(serverUrl + '/ws', {
                'login': 'guest',
                'passcode': 'guest'
            }).then(function() {
                subscribeMessage(connectCallback);
            }, function(error) {
                errorCallback(error);
            });
        }

        function subscribe(url, callBack) {
            return $stomp.subscribe(url, callBack);
        }

        function subscribeMessage(callBack) {
            return subscribe('/topic/webSocket/message', callBack);
        }

        function sendMsgBySocket(msg) {
            $stomp.send('/app/message', msg, {});
        }

        return {
            connect: connect,
            sendMsgBySocket: sendMsgBySocket
        };
    });
