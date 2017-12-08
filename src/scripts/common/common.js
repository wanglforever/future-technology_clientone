'use strict';
angular.module('udbs.common', ['ui.select', 'toastr', 'ngStorage','frapontillo.bootstrap-switch','ui.sortable'])
    .config(function($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('udbs-');
    });
