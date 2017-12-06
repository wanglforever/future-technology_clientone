/**
 * @author fangxinhe 2017/3/27
 * 登录时病区列表相关
 */
'use strict';
angular.module('iot-call.backup')
    .factory('Ward', [function () {
        function Ward(){
            //是否显示下拉选择框
            this.menuStatus = false;
            this.mouseInMenu = false;
            //病区列表
            this.wardInfos = [];
            //当前选择的病区
            this.curWard = {
                wardName:'',
                wardNo:''
            }
        }

        /**
         * 根据后台查询的数据初始化病区列表,并默认选择一个病区
         * @param wards
         */
        Ward.prototype.init = function (wards) {
            this.wardInfos = wards || [];
            this.chooseWardName(0);
        };

        /**
         *显示病区选择框
         */
        Ward.prototype.showMenu = function () {
            this.menuStatus = true;
        };
        /**
         *隐藏病区选择框
         */
        Ward.prototype.hideMenu = function () {
            if (!this.mouseInMenu) {
                this.menuStatus = false;
            }
        };

        /**
         * 鼠标是否离开选择框
         * @param value
         */
        Ward.prototype.mouseEvent = function (value) {
            this.mouseInMenu = value.type != 'mouseleave';
        };

        /**
         * 下拉列表中选择病区名称
         * @param index
         */
        Ward.prototype.chooseWardName = function (index) {
            if (this.wardInfos.length != 0) {
                this.curWard.wardName = this.wardInfos[index].wardName;
                this.curWard.wardNo = this.wardInfos[index].wardNo;
            }
            this.mouseInMenu = false;
            this.menuStatus = false;
        };

        /**
         * 病区列表是否为空
         * @returns {boolean}
         */
        Ward.prototype.isEmpty = function(){
            return !this.wardInfos.length
        };

        /**
         * 清空科室列表
         * @returns {boolean}
         */
        Ward.prototype.clearWard = function(){
            //病区列表
            this.wardInfos = [];
            //当前选择的病区
            this.curWard = {
                wardName:'',
                wardNo:''
            }
        };

        return Ward;
    }]);
