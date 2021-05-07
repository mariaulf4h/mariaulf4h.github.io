define([
    'angular',
    'jquery'
], function(angular, $) {
    'use strict';
    /**
     * Mainnav module:
     */
    angular.module('autolinks.mainnav', []);
    angular.module('autolinks.mainnav')
        // Mainnav Controller
        .controller('MainnavController', ['$scope', '$rootScope', '$mdDialog', '$mdSidenav',
        function ($scope, $rootScope , $mdDialog, $mdSidenav) {

          $scope.lockLeft = true;
          $scope.progressBarIsInactive = false;
          $scope.toolbarIsHidden = true;

          $rootScope.$on('progressBarIsInactive', function (event) {
            $scope.progressBarIsInactive = true;
            $scope.toolbarIsHidden = false;
            $mdSidenav('left').toggle();
          });

          $scope.close = function () {
           // Component lookup should always be available since we are not using `ng-if`
           $mdSidenav('left').close()
             .then(function () {
               $log.debug("close LEFT is done");
             });
         };

         $scope.toggleManual = function($event) {
            $mdSidenav('left').close();
            var parentEl = angular.element(document.body);
            $mdDialog.show({
              parent: parentEl,
              targetEvent: $event,
              template:

              '<md-dialog aria-label="User Manual" style="z-index: 1009;padding-left:320px;">' +
                  '<form>' +
                    '<md-toolbar>' +
                      '<div class="md-toolbar-tools">' +
                        '<h2>User Manual</h2>' +
                        '<span flex></span>' +
                        '<md-button class="md-icon-button" ng-click="cancel()">' +
                          '<md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
                        '</md-button>' +
                      '</div>' +
                    '</md-toolbar>' +
                  '<md-dialog-content style="max-width:800px;max-height:810px; ">' +
                      '<md-tabs md-dynamic-height md-border-bottom>' +
                        '<md-tab label="Build Knowledge graphs">' +
                          '<md-content class="md-padding">' +
                            // '<h1 class="md-display-2">Build knowledge graphs:</h1>' +
                            '<p>1. Click and hold; then select an add icon to create a new node.</p>' +
                            '<p>2. Click a node to show a qTip; click a link icon to draw a relational edge to other nodes.</p>' +
                            '<p>3. Click a node to show a qTip; click an arrows icon to move to a parent node or merge to other single nodes.</p>' +
                            '<p>4. Click a node/an edge to show a qTip; click edit icon to open node details. Then the side navigation will be shown. </p>' +
                            '<p>5. To change the name of a node, we just need to change the label in the side navigation and click the update button.</p>' +
                            '<br/>' +
                            '<p>*) Better with Chrome Web Browser.</p>' +
                          '</md-content>' +
                        '</md-tab>' +
                        // '<md-tab label="three">' +
                        //   '<md-content class="md-padding">' +
                        //     '<h1 class="md-display-2">Tab Three</h1>' +
                        //   '<p>Integer turpis erat, porttitor vitae mi faucibus, laoreet interdum tellus. Curabitur posuere molestie dictum. Morbi eget congue risus, quis rhoncus quam. Suspendisse vitae hendrerit erat, at posuere mi. Cras eu fermentum nunc. Sed id ante eu orci commodo volutpat non ac est. Praesent ligula diam, congue eu enim scelerisque, finibus commodo lectus.</p>' +
                        //   '</md-content>' +
                        // '</md-tab>' +
                      '</md-tabs>' +
                    '</md-dialog-content>' +

                    '<md-dialog-actions layout="row">' +
                      // '<md-button href="http://en.wikipedia.org/wiki/Mango" target="_blank" md-autofocus>' +
                      // '  More on Wikipedia' +
                      // '</md-button>' +
                      '<span flex></span>' +
                      '<md-button ng-click="closeDialog()" style="margin-right:20px;" >' +
                        'Close' +
                      '</md-button>' +
                    '</md-dialog-actions>' +
                  '</form>' +
                  '</md-dialog>',
                // '<md-dialog aria-label="List dialog">' +
                // '  <md-dialog-content class="md-dialog-content">'+
                // '  <h2 class="md-title"><b> Welcome to mariaulf4h.github.io!</b></h2>' +
                // '  <div class="md-dialog-content-body">In this website, you can observe my <i>resume</i> interactively in the knowledge graphs. </div>' +
                // '  <div class="md-dialog-content-body">You can create a node, a relation, a compound graph, or even build your own <i>knowledge graphs.</i> </div>' +
                // '  <div class="md-dialog-content-body">Click a <i>circle-nav</i> button in the lower right corner to get more features. </div>' +
                // '  </md-dialog-content>' +
                // '  <md-dialog-actions>' +
                // '    <md-button ng-click="closeDialog()" class="md-primary">' +
                // '      Okay!' +
                // '    </md-button>' +
                // '  </md-dialog-actions>' +
                // '</md-dialog>',
              locals: {
                items: $scope.items
              },
              controller: DialogController
           });
           function DialogController($scope, $mdDialog, items) {
             $scope.items = items;
             $scope.closeDialog = function() {
               $mdDialog.hide();
             }
           }
         };

         $scope.toggleStats = function($event) {
            // $mdSidenav('left').close();
            var parentEl = angular.element(document.body);
            $mdDialog.show({
              parent: parentEl,
              targetEvent: $event,
              template:

              '<md-dialog aria-label="" style="z-index: 1009;">' +
                  '<form>' +
                    '<md-toolbar>' +
                      '<div class="md-toolbar-tools">' +
                        '<h2>maria\'s Tech Stack Statistics</h2>' +
                        '<span flex></span>' +
                        '<md-button class="md-icon-button" ng-click="cancel()">' +
                          '<md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon>' +
                        '</md-button>' +
                      '</div>' +
                    '</md-toolbar>' +
                  '<md-dialog-content style="max-width:1800px;max-height:810px; ">' +
                      '<md-tabs md-dynamic-height md-border-bottom>' +
                        '<md-tab label="Bar Chart">' +
                          '<md-content class="md-padding">' +
                            '<iframe src="skillsdata.html" width="625px" height="325px" style="border:none"></iframe>' +
                          '</md-content>' +
                        '</md-tab>' +
                        '<md-tab label="Kiviat Diagrams">' +
                          '<md-content class="md-padding">' +
                            '<iframe src="radar.html" width="710px" height="555px" style="border:none"></iframe>' +
                          '</md-content>' +
                        '</md-tab>' +
                        // '<md-tab label="three">' +
                        //   '<md-content class="md-padding">' +
                        //     '<h1 class="md-display-2">Tab Three</h1>' +
                        //   '<p>Integer turpis erat, porttitor vitae mi faucibus, laoreet interdum tellus. Curabitur posuere molestie dictum. Morbi eget congue risus, quis rhoncus quam. Suspendisse vitae hendrerit erat, at posuere mi. Cras eu fermentum nunc. Sed id ante eu orci commodo volutpat non ac est. Praesent ligula diam, congue eu enim scelerisque, finibus commodo lectus.</p>' +
                        //   '</md-content>' +
                        // '</md-tab>' +
                      '</md-tabs>' +
                    '</md-dialog-content>' +

                    '<md-dialog-actions layout="row">' +
                      // '<md-button href="http://en.wikipedia.org/wiki/Mango" target="_blank" md-autofocus>' +
                      // '  More on Wikipedia' +
                      // '</md-button>' +
                      '<span flex></span>' +
                      '<md-button ng-click="closeDialog()" style="margin-right:20px;" >' +
                        'Close' +
                      '</md-button>' +
                    '</md-dialog-actions>' +
                  '</form>' +
                  '</md-dialog>',
                // '<md-dialog aria-label="List dialog">' +
                // '  <md-dialog-content class="md-dialog-content">'+
                // '  <h2 class="md-title"><b> Welcome to mariaulf4h.github.io!</b></h2>' +
                // '  <div class="md-dialog-content-body">In this website, you can observe my <i>resume</i> interactively in the knowledge graphs. </div>' +
                // '  <div class="md-dialog-content-body">You can create a node, a relation, a compound graph, or even build your own <i>knowledge graphs.</i> </div>' +
                // '  <div class="md-dialog-content-body">Click a <i>circle-nav</i> button in the lower right corner to get more features. </div>' +
                // '  </md-dialog-content>' +
                // '  <md-dialog-actions>' +
                // '    <md-button ng-click="closeDialog()" class="md-primary">' +
                // '      Okay!' +
                // '    </md-button>' +
                // '  </md-dialog-actions>' +
                // '</md-dialog>',
              locals: {
                items: $scope.items
              },
              controller: DialogController
           });
           function DialogController($scope, $mdDialog, items) {
             $scope.items = items;
             $scope.closeDialog = function() {
               $mdDialog.hide();
             }
           }
         };

         // var confirm = $mdDialog.confirm()
         // .title('Welcome to mariaulf4h.github.io!')
         // .textContent('Click circe-nav button in the lower right corner to get more features')
         // // .targetEvent(doc)
         // .ok('Okay!')
         //
         // $mdDialog.show(confirm).then(function() {
         //
         // });

         $scope.showTabDialog = function(ev) {
          $mdDialog.show({
            templateUrl: '/assets/partials/tabdialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          })
              .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
              }, function() {
                $scope.status = 'You cancelled the dialog.';
              });
        };


          $rootScope.$on('toggleMainnav', function() {
            $scope.lockLeft = !$scope.lockLeft;
          });
        }
      ]);
});
