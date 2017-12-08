'use strict';
angular.module('udbs.common')
    .factory('speech', function() {

        var isSupport = false;
        var SpeechSynthesisUtterance;
        var speech;
        var speechMsgs;
        var curSpeechObj = null;

        if ('speechSynthesis' in window) {
            SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
            speech = window.speechSynthesis;
            speechMsgs = [];
            isSupport = true;
        }

        function readOutLoud(bedInfo, times) {
            if (isSupport) {
                var message = getSpeechMsg(bedInfo);
                //设置朗读内容和属getSpeechObj(message)性
                var speechObj = getSpeechObj(message);
                speechMsgs.push({
                    msg: message,
                    speechObj: speechObj,
                    times: times || 3
                });
                smartSpeechOut();
            }
        }

        function stopRead(bedInfo) {
            if (isSupport) {
                if (bedInfo) {
                    var speechMsg = getSpeechMsg(bedInfo);
                    if (curSpeechObj && curSpeechObj.text === speechMsg) {
                        speech.cancel();
                        smartSpeechOut();
                    } else {
                        for (var i = 0; i < speechMsgs.length; i++) {
                            if (speechMsg === speechMsgs[i].msg) {
                                speechMsgs.splice(i, 1);
                            }
                        }
                    }
                } else {
                    speech.cancel();
                }
            }
        }

        function smartSpeechOut() {
            if (speechMsgs.length > 0 && !speech.speaking) {
                var speechMsg = speechMsgs.shift();
                for (var i = 0; i < speechMsg.times; i++) {
                    speech.speak(speechMsg.speechObj);
                }
            }
        }

        function getSpeechObj(msg) {
            var speechObj = new SpeechSynthesisUtterance();
            speechObj.volume = 1; //音量0-1，1表示和系统音量一致
            speechObj.rate = 0.9; //说话速度0.1-10
            speechObj.pitch = 1; //说话音调0-2
            speechObj.text = msg;

            speechObj.onstart = function() {
                curSpeechObj = event.utterance;
            };

            speechObj.onend = function() {
                curSpeechObj = null;
                smartSpeechOut();
            };
            return speechObj;
        }

        function getSpeechMsg(bedInfo) {
            return bedInfo.bedNo + '床在呼叫';
        }

        function clearAllSpeech() {
            stopRead();
            speechMsgs.splice(0, speechMsgs.length);
        }

        return {
            readOutLoud: readOutLoud,
            stopRead: stopRead,
            clearAllSpeech: clearAllSpeech
        };
    });
