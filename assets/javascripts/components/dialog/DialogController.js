define([
    'angular',
    'jquery'
], function(angular) {
    'use strict';
    /**
     * viewer module:
     */
    angular.module('autolinks.upload', []);
    angular.module('autolinks.upload')
        // Viewer Controller
        .controller('UploadFileController', ['Upload', '$window', '$scope', '$rootScope', '$mdDialog', '$q', 'EndPointService', '$mdToast', '$timeout',
        function (Upload, $window, $scope, $rootScope, $mdDialog, $q, EndPointService, $mdToast, $timeout) {

          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };

        }
      ]);
});
