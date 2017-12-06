'use strict';
angular.module('iot-call.common', ['ui.select', 'toastr', 'ngStomp', 'ngStorage','frapontillo.bootstrap-switch','ui.sortable'])
    .config(function($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('iotCall-');
    });
