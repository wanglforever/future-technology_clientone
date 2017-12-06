'use strict';
angular.module('iot-call.call')
    .controller('callController', ['$scope', '$state', '$stomp', '$timeout', 'callService', 'webSocket', 'userInfoService', 'toast', 'speech', 'configService',
        function($scope, $state, $stomp, $timeout, callService, webSocket, userInfoService, toast, speech, configService) {
            $scope.hasNurses = [];
            $scope.noNurses = [];
            $scope.callBeds = [];
            $scope.callBedsMore = [];
            $scope.nurseStationDesp = '护士站处理';

            var callBeds = [];
            var wardNo = userInfoService.getWardNo();
            var processingBeds = {};


            function getNursesAndPatients() {
                callService.getNursesAndPatients(wardNo).then(function(result) {
                    $scope.nursesAndPatients = result.data || [];
                });
            }

            configService.getNoticeList().then(function(result) {
                $scope.noticesList = result.data.filter(function(val) {
                    return !!val.isShow;
                });
                $('.carousel').carousel({
                    interval: 7000
                });
            });

            getNursesAndPatients();

            callService.getCallBeds(wardNo).then(function(result) {
                callBeds = result.data || [];
                splitCallBeds();
            });

            speech.clearAllSpeech();

            webSocket.connect(function(result) {
                console.log(result);
                if (result.wardNo === wardNo) {
                    if (result.callState === 1) { //患者呼叫
                        //清除删除呼叫的timeout，防止新加入的呼叫被清掉
                        var processingTimeout = processingBeds[result.patId];
                        if (processingTimeout) {
                            $timeout.cancel(processingTimeout);
                            processingBeds[result.patId] = null;
                        }

                        $scope.$apply(function() {
                            //重载呼叫列表
                            reloadCallBeds(result);

                            //高亮病人列表
                            activePatient(result);
                        });

                        //病人呼叫的话，朗读出来
                        speech.readOutLoud(result);
                    } else if (result.callState === 0) { //如果是护士扫描枪处理

                        //处理呼叫
                        $scope.$apply(function() {
                            handleCall(result, result.callProcessStaffName);
                        });
                    }
                }
            }, function(error) {
                console.log(error);
            });

            //处理呼叫
            $scope.handleCall = function(bedInfo, isHandled) {
                if (!isHandled) {
                    // webSocket.sendMsgBySocket('test');
                    bedInfo.isHandled = true;
                    callService.answerCall({
                        bedNo: bedInfo.bedNo,
                        patId: bedInfo.patId,
                        staffId: bedInfo.staffId,
                        wardNo: bedInfo.wardNo
                    }).then(function(result) {
                        if (result.status === 'SUCCESS') {
                            toast.info('处理呼叫成功');
                            //处理呼叫
                            handleCall(bedInfo, '护士站处理');
                        } else {
                            toast.error('处理呼叫失败');
                            bedInfo.isHandled = false;
                        }
                    });
                }
            };

            $scope.refresh = function() {
                getNursesAndPatients();
            };

            function splitCallBeds() {
                $scope.callBeds = callBeds.slice(0, 4);
                $scope.callBedsMore = callBeds.slice(4);
            }

            /**
             * 重新加载呼叫床位
             * @param  {[type]}  bedInfo  [description]
             * @param  {Boolean} isDelete 是否删除，默认false
             * @return {[type]}           [description]
             */
            function reloadCallBeds(bedInfo, isDelete) {
                for (var i in callBeds) {
                    if (bedInfo.bedNo === callBeds[i].bedNo) {
                        callBeds.splice(i, 1);
                    }
                }
                if (!isDelete) {
                    callBeds.unshift(bedInfo);
                }
                splitCallBeds();
            }

            /**
             * 高亮病人
             * @param  {[type]}  bedInfo    [description]
             * @param  {Boolean} isUnActive 是否反激活，默认false
             * @return {[type]}             [description]
             */
            function activePatient(bedInfo, isUnActive) {
                for (var i in $scope.hasNurses) {
                    var tmpNurse1 = $scope.hasNurses[i];
                    for (var m in tmpNurse1.bedInfoList) {
                        var tmpPatient1 = tmpNurse1.bedInfoList[m];
                        tmpPatient1.isActive = !isUnActive && bedInfo.patId === tmpPatient1.patId;
                    }
                }
                for (var j in $scope.noNurses) {
                    var tmpPatient2 = $scope.noNurses[j];
                    tmpPatient2.isActive = !isUnActive && bedInfo.patId === tmpPatient2.patId;
                }
            }

            /**
             * 处理呼叫
             * @param  {[type]} bedInfo              [description]
             * @param  {[type]} callProcessStaffName [description]
             * @return {[type]}                      [description]
             */
            function handleCall(bedInfo, callProcessStaffName) {
                //停止该病人的朗读
                speech.stopRead(bedInfo);
                //设置谁处理了
                $scope.nurseStationDesp = callProcessStaffName;
                //定时清除病人的呼叫状态
                var processingTimeout = $timeout(function() {
                    reloadCallBeds(bedInfo, true);
                    activePatient(bedInfo, true);
                    processingBeds[bedInfo.patId] = null;
                }, 5000);
                processingBeds[bedInfo.patId] = processingTimeout;
            }
        }
    ]);
