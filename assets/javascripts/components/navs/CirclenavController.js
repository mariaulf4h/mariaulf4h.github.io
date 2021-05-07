define([
    'angular',
    'jquery'
], function(angular, $) {
    'use strict';
    /**
     * Circlenav module:
     */
    angular.module('autolinks.circlenav', []);
    angular.module('autolinks.circlenav')
        // Circlenav Controller
        .controller('CirclenavController', ['$scope', '$rootScope', '$mdSidenav', 'EntityService', '$mdToast', '$mdDialog',
        function ($scope, $rootScope, $mdSidenav, EntityService, $mdToast, $mdDialog) {

          $scope.lockLeft = true;

          $scope.init = function() {
            	var ul = $("#navs"),
                  li = $("#navs li"),
                  i = li.length,
                  n = i-1,
                  r = 120;

            	ul.unbind('click').click(function() {
            		$(this).toggleClass('active');
            		if ($(this).hasClass('active')){
            			for (var a = 0; a < i; a++){
            				li.eq(a).css({
            					'transition-delay':""+(50*a)+"ms",
            					'-webkit-transition-delay':""+(50*a)+"ms",
            					'right':(r*Math.cos(90/n*a*(Math.PI/180))),
            					'top':(-r*Math.sin(90/n*a*(Math.PI/180)))
            				});
            			}
            		} else {
            			li.removeAttr('style');
            		}
            	});
          };

          $scope.init();

          $scope.addCompound = function(){
            if (cy.$(':selected').length > 0) {
              EntityService.openSideNav('createCompound');
            } else {
              $mdToast.show(
                $mdToast.simple()
                  .textContent('To use this feature, please select one or more nodes first!')
                  .position('top right')
                  .theme("warn-toast")
                  .hideDelay(3500)
              );
            }
          };

          $scope.centerGraph = function() {
            $rootScope.$emit('centerGraph');
          };


          $scope.hasManual = function() {
            if(!localStorage.mariaCirclenavIntro) {
              showHint();
            }

            function showHint($event) {
               $mdSidenav('left').close();
               var parentEl = angular.element(document.body);
               $mdDialog.show({
                 parent: parentEl,
                 targetEvent: $event,
                 template:
                   '<md-dialog aria-label="List dialog" style="z-index: 1009;">' +
                   '  <md-dialog-content class="md-dialog-content">'+
                   '  <div class="md-dialog-content-body">For further details of manual, click open mainnav button and click user manual</div>' +
                   '  </md-dialog-content>' +
                   '  <md-dialog-actions>' +
                   '    <md-button ng-click="closeDialog()" class="md-primary">' +
                   '      Okay!' +
                   '    </md-button>' +
                   '  </md-dialog-actions>' +
                   '</md-dialog>',
                 locals: {
                   items: $scope.items
                 },
                 controller: DialogController
              });
              function DialogController($scope, $mdDialog, items) {
                $scope.items = items;
                $scope.closeDialog = function() {
                  localStorage.setItem("mariaCirclenavIntro", "done");
                  $mdDialog.hide();
                }
              }
            };
          };


          $scope.layoutReset = function(){
            $rootScope.$broadcast('layoutReset');
          };

          $scope.toggleSidenav = function() {
            // if (window.innerWidth > 1280) {
            //   $rootScope.$emit('toggleMainnav');
            // } else {
              $mdSidenav('left').toggle();
            // }
          };
        }
      ]);
});
