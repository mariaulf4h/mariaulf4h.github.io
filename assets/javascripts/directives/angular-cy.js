define([
    'angular',
    'jquery',
    'cytoscape',
    'cytoscape-cose-bilkent',
    'cytoscape-cxtmenu',
    'cytoscape-panzoom',
    'cytoscape-qtip',
    'cytoscape-expand-collapse',
    'cytoscape-edgehandles',
    'cytoscape.js-undo-redo',
    'qtip2',
    'bootstrap',
], function(angular, $, cytoscape, regCose, cxtmenu, panzoom, cyqtip, expandCollapse,edgehandles, undoRedo, qtip2) {
    'use strict';

    angular.module('ngCy', [])

    .directive('cytoscape', function($rootScope) {
        // graph visualisation by - https://github.com/cytoscape/cytoscape.js
        return {
            restrict: 'EA',
            template :'<div id="cy-network"></div>',
            replace: true,
            scope: {
                // data objects to be passed as an attributes - for nodes and edges
                data: '=',
                cyData: '=',
                cyEdges: '=',
                options: '=',
                // controller function to be triggered when clicking on a node
                cyClick:'&',
                events: '='
            },
            link: function(scope, element, attrs, fn) {
                var networkEvents = [
                    'tap'
                ];
                // dictionary of colors by types. Just to show some design options
                scope.typeColors = {
                    'ellipse':'#992222',
                    'triangle':'#222299',
                    'rectangle':'#661199',
                    'roundrectangle':'#772244',
                    'pentagon':'#990088',
                    'hexagon':'#229988',
                    'heptagon':'#118844',
                    'octagon':'#335577',
                    'star':'#113355'
                };

                var cy = null;

                // klay(cytoscape);
                panzoom(cytoscape, $);
                expandCollapse(cytoscape, $);
                undoRedo(cytoscape);
                regCose(cytoscape);
                // cycola(cytoscape, cola);
                cyqtip(cytoscape, $);
                cxtmenu(cytoscape);
                edgehandles(cytoscape);


                scope.ehListeners = [];

                scope.$watch('data', function () {

                    var domContainer = document.getElementById('cy-network');
                    console.log(scope.data);
                    // graph  build
                    scope.doCy = function(){
                      // will be triggered on an event broadcast
                      // parse edges
                      // you can build a complete object in the controller and pass it without rebuilding it in the directive.
                      // doing it like that allows you to add options, design or what needed to the objects
                      // doing it like that is also good if your data object/s has a different structure

                      // Sanity check
                      if (scope.data == null) {
                          return;
                      }

                      // If we've actually changed the data set, then recreate the graph
                      // We can always update the data by adding more data to the existing data set
                      if (cy != null) {
                          cy.destroy();
                          cy = null;
                          // delete $rootScope.$$listeners['addEdge'];
                          // $rootScope.$destroy();
                          // ;
                          // cy.edgehandles().destroy();
                      }

                      for (var i=0; i<scope.cyEdges.length; i++)
                      {
                          // get edge source
                          var eSource = scope.cyEdges[i].source;
                          // get edge target
                          var eTarget = scope.cyEdges[i].target;
                          // get edge id
                          var eId = scope.cyEdges[i].id;
                          // build the edge object
                          var edgeObj = {
                              data:{
                                id:eId,
                                source:eSource,
                                target:eTarget
                              }
                          };
                          // adding the edge object to the edges array
                          scope.data.edges.push(edgeObj);
                      }

                      // parse data and create the Nodes array
                      // object type - is the object's group
                      for (var i=0; i<scope.cyData.length; i++)
                      {
                          // get id, name and type  from the object
                          var dId = scope.cyData[i].id;
                          var dName = scope.cyData[i].name;
                          var dType = scope.cyData[i].type;
                          // get color from the object-color dictionary

                          var typeColor = scope.typeColors[dType];
                          // build the object, add or change properties as you need - just have a name and id
                          var elementObj = {
                              // group:dType,
                              'data':{
                                  id:dId,
                                  name:dName,
                                  typeColor:typeColor,
                                  typeShape:dType,
                                  type:dType,

                          }};
                          // add new object to the Nodes array
                          scope.data.nodes.push(elementObj);
                      }

                      cy = window.cy = cytoscape({
                            container: domContainer,
                            layout: scope.options.layout,
                            style: scope.options.style,
                            elements: scope.data
                      });

                      var edgeHandleProps = {
                        preview: false,
                        complete: function( sourceNode, targetNode, addedEles ){
                          // fired when edgehandles is done and elements are added
                          // build the edge object
                          // get edge source
                          if (sourceNode.data && targetNode.data) {
                            // build the edge object

                            if (sourceNode.data() !== targetNode.data()) {
                              var edgeObj = {
                                  data:{
                                    id: sourceNode.data('id') + targetNode.data('id'),
                                    source: sourceNode.data('id'),
                                    target: targetNode.data('id'),
                                    name: 'has relation'
                                  }
                              };
                              addedEles.data().name = 'has relation';
                              // adding the edge object to the edges array
                              scope.data.edges.push(edgeObj);
                              edgeTipExtension(addedEles);
                            } else {
                              console.log("wow");
                            }

                          }
                          eh.enabled = false;
                        },
                        stop: function( sourceNode ) {
                          eh.enabled = false;
                        }
                      }
                      // ;
                      var eh = cy.edgehandles(edgeHandleProps);
                      eh.enabled = false;


                      scope.coordinate = {};
                      scope.selectedEntity = {};
                      scope.mergeMode = false;
                      scope.annotationHighlighted = null;


                      // if (scope.$parent.edgehandler) {
                      //   eh.enabled = true;
                      //   ;
                      //   eh.start( cy.$('node:selected').remove() );
                      // }

                      // Event listeners
                      // with sample calling to the controller function as passed as an attribute
                      cy.on('tap', 'node', function(e){
                          eh.enabled = false;
                          var evtTarget = e.target;
                          var nodeId = evtTarget.id();
                          scope.selectedEntity = evtTarget;

                          var eventIsDirect = evtTarget.same(this);
                          console.log(nodeId);
                          if( eventIsDirect ){
                            this.emit('directtap');
                          }
                          // scope.cyClick({value:nodeId});
                          // scope.$parent.EntityService.openSideNav(evtTarget);
                      })
                      .on('directtap', function(e) {
                        e.stopPropagation();
                      });

                      scope.coordinate = {};
                      scope.selectedEntity = {};

                      cy.on('taphold', function(e){
                          eh.enabled = false;
                          scope.coordinate = e.position;
                      });

                          // Events collection : mouseover, taphold, tapend, tap
                      cy.on('tapend', 'node', function(evt) {
                        var node = evt.target;
                        var nodeLabel = node.data('metadata') && node.data('metadata').label ? node.data('metadata').label : node.data('name');

                        //NOTE: merge node scenarios
                        if (scope.mergeMode) {
                          scope.coordinate = evt.position;
                          // var x = scope.coordinate.x;
                          // var y = scope.coordinate.y;
                          scope.mergeToParentNodes = {target: node, source: scope.selectedNodesToMerge, children: scope.selectedNodesToMerge.children()}
                          var confirm = scope.$parent.$mdDialog.confirm()
                               .title('Move to ' + nodeLabel +'?')
                               // .targetEvent(doc)
                               .ok('Yes, move!')
                               .cancel('Cancel');

                          scope.$parent.$mdDialog.show(confirm).then(function() {

                            const sourceData = scope.mergeToParentNodes.source;
                            const targetData = scope.mergeToParentNodes.target;
                            const hasChildren = scope.mergeToParentNodes.source.children().length > 0 ? true : false;


                            const mvData = sourceData.move({parent: targetData.data('id')});
                            nodeTipExtension(mvData);
                            nodeTipExtension(mvData.descendants());
                            edgeTipExtension(mvData.connectedEdges());

                            scope.mergeMode = false;

                            // if (sourceData.data('rid') === targetData.data('rid')) {
                            //   scope.$parent.$mdToast.show(
                            //         scope.$parent.$mdToast.simple()
                            //           .textContent('Merging to the same node is not allowed')
                            //           .position('top right')
                            //           .theme("warn-toast")
                            //           .hideDelay(3500)
                            //       );
                            // } else {
                            //   if (!node.isParent()) {
                            //     if (cy.$(':selected').length > 0) {
                            //       scope.$parent.EntityService.openSideNav('createCompound');
                            //     } else {
                            //       scope.$parent.$mdToast.show(
                            //             scope.$parent.$mdToast.simple()
                            //               .textContent('Please select one or more nodes to be children')
                            //               .position('top right')
                            //               .theme("warn-toast")
                            //               .hideDelay(3500)
                            //           );
                            //     }
                            //   } else {
                            //     const before = {
                            //       "rid": sourceData.data('rid'),
                            //       "cid": sourceData.data('cid'),
                            //       "metadata": sourceData.data('metadata'),
                            //       "value": sourceData.data('value'),
                            //     };
                            //
                            //     const after = {
                            //       "rid": sourceData.data('rid'),
                            //       "cid": targetData.data('rid'),
                            //       "metadata": sourceData.data('metadata'),
                            //       "value": sourceData.data('value'),
                            //     };
                            //     const data = { before: before, after: after };
                            //
                            //     scope.$parent.EndPointService.editResource(data).then(function(response) {
                            //
                            //       var hasDuplicateInTarget = _.filter(targetData.children(), function(d) { return d.data().rid === sourceData.data().rid });
                            //
                            //       if (hasDuplicateInTarget.length < 1) {
                            //         if (sourceData.connectedEdges().length > 0) {
                            //           var sourceJson = sourceData.json();
                            //           sourceJson.data.id = targetData.data('id') + (sourceJson.data.parent ? sourceJson.data.id.replace(sourceJson.data.parent, "") : sourceJson.data.id);
                            //           sourceJson.data.parent = targetData.data('id');
                            //           sourceJson.data.cid = targetData.data('rid');
                            //           sourceJson.position.x = (sourceJson.position.x + targetData.position().x) / 2;
                            //           sourceJson.position.y = (sourceJson.position.y + targetData.position().y) / 3;
                            //
                            //           const mvData = cy.add(sourceJson);
                            //           nodeTipExtension(mvData);
                            //           nodeTipExtension(mvData.descendants());
                            //           edgeTipExtension(mvData.connectedEdges());
                            //         } else {
                            //           scope.selectedNodesToMerge.hide();
                            //
                            //           // targetData.data().cid = newCompound.data('rid');
                            //           // const mvDataTarget = targetData.move({parent: newCompound.data('id')});
                            //           // nodeTipExtension(mvDataTarget);
                            //
                            //           sourceData.data().cid = targetData.data('rid');
                            //           const mvData = sourceData.move({parent: targetData.data('id')});
                            //           nodeTipExtension(mvData);
                            //           nodeTipExtension(mvData.descendants());
                            //           edgeTipExtension(mvData.connectedEdges());
                            //         }
                            //       }  else {
                            //           scope.$parent.$mdToast.show(
                            //                 scope.$parent.$mdToast.simple()
                            //                   .textContent(((sourceData.data('metadata') && sourceData.data('metadata').label) ? sourceData.data('metadata').label : sourceData.data('name'))
                            //                   + ' is already in ' + ((targetData.data('metadata') && targetData.data('metadata').label) ? targetData.data('metadata').label : targetData.data('name')))
                            //                   .position('top right')
                            //                   .theme("warn-toast")
                            //                   .hideDelay(3500)
                            //               );
                            //         }
                            //       scope.mergeMode = false;
                            //     });
                            //   }
                            // }
                            // addNewNode(data, targetData, hasChildren);
                          }, function() {
                            scope.mergeMode = false;
                          });
                          // $rootScope.$emit('mergeToParent');
                        } else {
                          // console.log( 'tapend ' + node.id() );
                          //console.log(x, y);
                        }
                        // evt.neighborhood('edge').style( { 'line-color' : 'black' });
                        // evt.connectedEdges().style( { 'line-color' : 'black' });
                      });

                      cy.nodes().forEach(function(n){
                        if (n.data('image')) {
                          cy.style()
                            .selector('#'+ n.data('id'))
                            .css(
                              {
                              'shape': 'roundrectangle',
                              'background-image': n.data('image'),
                              'background-color': 'rgba(255, 255, 255, 0)',
                              'text-valign': 'bottom',
                              'width': '50',
                              'height': '50'
                              }
                            ).update();
                        }
                      });

                      cy.nodes().forEach(function(n){
                        nodeTipExtension(n);
                      });

                      cy.edges().forEach(function(e) {
                        edgeTipExtension(e);
                      });

                      function edgeTipExtension(e) {
                        _.forEach(e, function(e) {
                          if (e.data('name')) {
                            cy.$('#'+ e.data('id')).qtip({
                              content: {
                                  text: function(event, api) {
                                    scope.selectedEntity = e;
                                    return (
                                    '<div class="edge-buttons">' +
                                    '<button id="editEdge" class="node-button"><i class="fa fa-pencil fa-2x"/></button>' +
                                    '</div>'
                                    )
                                  }
                              },
                              position: {
                                my: 'bottom center',
                                at: 'top center'
                              },
                              style: {
                                  name: 'qtip-content'
                              }
                            });
                          }
                        });
                      }

                      function nodeTipExtension(n) {
                        _.forEach(n, function(n) {
                          if (!n.isParent()) {
                            cy.$('#'+ n.data('id')).qtip({
                              content: {
                                  text: function(event, api) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    scope.selectedEntity = n;
                                    console.log(scope.selectedEntity.id());
                                    return (
                                    '<div class="node-buttons">' +
                                    '<button id="moveNode" class="node-button"><i class="fa fa-arrows-alt fa-2x"/></button>' +
                                    '<button id="addEdge" class="node-button"><i class="fa fa-link fa-2x"/></button> ' +
                                    '<button id="editNode" class="node-button" style="color: blue"><i class="fa fa-pencil fa-2x"/></button>' +
                                    '</div>'
                                    )
                                  }
                              },
                              show: {
                                event: 'directtap'
                              },
                              position: {
                                my: 'bottom center',
                                at: 'top center'
                              },
                              style: {
                                  name: 'qtip-content'
                              }
                            });

                            cy.$('#'+ n.data('id')).qtip({
                              content: {
                                  text: function(event, api) {
                                    if (n.data('desc')) {
                                      return (
                                      '<div class="node-description">' + n.data('desc') + '</div>'
                                      )
                                    }
                                  }
                              },
                              position: {
                                my: 'top center',
                                at: 'bottom center'
                              },
                              style: {
                                classes: 'qtip-bootstrap',
                                tip: {
                                  width: 16,
                                  height: 8
                                },
                              }
                            });
                          }
                        });
                      }

                      var exp = cy.expandCollapse({
                        // layoutBy: {
                        //   name: "cose-bilkent",
                        //   // animate: "end",
                        //   randomize: false,
                        //   fit: true
                        // },
                        fisheye: false,
                        animate: false
                      });

                      // exp.collapseRecursively(cy.nodes('[id = "full_stack_developer"]'));
                      // cy.layout({name: 'cose-bilkent'}).run();

                        // the default values of each option are outlined below:
                        var defaults = {
                          zoomFactor: 0.05, // zoom factor per zoom tick
                          zoomDelay: 45, // how many ms between zoom ticks
                          minZoom: 0.1, // min zoom level
                          maxZoom: 10, // max zoom level
                          fitPadding: 50, // padding when fitting
                          panSpeed: 10, // how many ms in between pan ticks
                          panDistance: 10, // max pan distance per tick
                          panDragAreaSize: 75, // the length of the pan drag box in which the vector for panning is calculated (bigger = finer control of pan speed and direction)
                          panMinPercentSpeed: 0.25, // the slowest speed we can pan by (as a percent of panSpeed)
                          panInactiveArea: 8, // radius of inactive area in pan drag box
                          panIndicatorMinOpacity: 0.5, // min opacity of pan indicator (the draggable nib); scales from this to 1.0
                          zoomOnly: false, // a minimal version of the ui only with zooming (useful on systems with bad mousewheel resolution)
                          fitSelector: undefined, // selector of elements to fit
                          animateOnFit: function(){ // whether to animate on fit
                            return false;
                          },
                          fitAnimationDuration: 1000, // duration of animation on fit

                          // icon class names
                          sliderHandleIcon: 'fa fa-minus',
                          zoomInIcon: 'fa fa-plus',
                          zoomOutIcon: 'fa fa-minus',
                          resetIcon: 'fa fa-expand'
                        };

                        cy.panzoom( defaults );


                        // cy.cxtmenu({
                        //   selector: 'node, edge',
                        //   fillColor: 'rgba(95, 239, 228, 0.84)',
                        //   // openMenuEvents: 'tap',
                        //   commands: [
                        //     {
                        //       content: '<span class="fa fa-flash fa-2x"></span>',
                        //       select: function(ele){
                        //         console.log( ele.id() );
                        //       }
                        //     },
                        //
                        //     {
                        //       content: '<span class="fa fa-star fa-2x"></span>',
                        //       select: function(ele){
                        //         console.log( ele.data('name') );
                        //       },
                        //       disabled: true
                        //     },
                        //
                        //     {
                        //       content: 'Text',
                        //       select: function(ele){
                        //         console.log( ele.position() );
                        //       }
                        //     }
                        //   ]
                        // });

                        cy.cxtmenu({
                        selector: 'core',
                        fillColor: 'rgba(95, 239, 228, 0.84)',
                        openMenuEvents: 'taphold',
                        commands: [
                          {
                            content: '<span class="fa fa-plus-circle fa-2x"></span>',
                            select: function(e){
                              var x = scope.coordinate.x;
                              var y = scope.coordinate.y;
                              var nodeObj = {
                                  data: {
                                    id: 'n' + scope.data.nodes.length,
                                    name: 'new'
                                  },
                                  position: {
                                    x,
                                    y
                                  }
                              };
                              var n = cy.add(nodeObj);
                              scope.data.nodes.push(nodeObj);
                              nodeTipExtension(n);
                              cy.fit();
                            }
                          },

                          {
                            content: '<span class="fa fa-ban fa-2x"></span>',
                            select: function(){
                              console.log( 'function 2' );
                            }
                          }
                        ]
                      });

                      $rootScope.$on('addEntity', function(event, entity){
                        var nodes = scope.data.nodes;
                        var edges = scope.data.edges;
                        var newNode = [];
                        var newEdge = [];

                        if (entity) {
                          _.forEach(entity.value, function(n) {
                            function extractEntity(n, parent = null) {

                              let s = n.value.subject;
                              let p = n.value.predicate;
                              let o = n.value.object;

                              function extractSubject(n) {
                                if (_.isArray(n[0].value)) {
                                  return extractSubject(n[0].value);
                                }
                                if(_.isObject(n[0].value)) {
                                  return n[0].value.subject;
                                }
                                return n[0].value;
                              }

                              function extractObject(n) {
                                // ;
                                if (_.isArray(n[0].value)) {
                                  return extractObject(n[0].value);
                                }
                                if(_.isObject(n[0].value)) {
                                  return n[0].value.subject;
                                }
                                return n[0].value;
                              }

                              function extractPredicate(n) {
                                if (_.isArray(n[0].value)) {
                                  return extractPredicate(n[0].value);
                                }
                                if(_.isObject(n[0].value)) {
                                  return n[0].value.subject;
                                }
                                return n[0].value;
                              }


                              if (_.isArray(s.value)) {
                                var s1 = extractSubject(s.value);
                                var subject = {
                                    cid: s1.cid,
                                    rid: s1.rid,
                                    metadata: s1.metadata,
                                    id: (s1.value + '_as_parent').replace(/\s/g, ''),
                                    name: s1.metadata.label ? s1.metadata.label : s1.value + '',
                                    parent: parent ? parent.id : null
                                };
                              } else if (_.isObject(s.value)) {
                                // var s = extractSubject(n.value);
                                var subject = {
                                    cid: s.cid,
                                    rid: s.rid,
                                    metadata: s.metadata,
                                    id: (s.value + '_as_parent').replace(/\s/g, ''),
                                    name: s.metadata.label ? s.metadata.label : s.value + '',
                                    parent: parent ? parent.id : null
                                };
                              } else {
                                var subject = {
                                    cid: s.cid,
                                    rid: s.rid,
                                    metadata: s.metadata,
                                    id: (s.value + '').replace(/\s/g, ''),
                                    name: s.metadata.label ? s.metadata.label : s.value + '',
                                    parent: parent ? parent.id : null
                                };
                              }

                              if (_.isArray(o.value)) {
                                var o1 = extractObject(o.value);
                                var object = {
                                    cid: o1.cid,
                                    rid: o1.rid,
                                    metadata: o1.metadata,
                                    id: (o1.value + '_as_parent').replace(/\s/g, ''),
                                    name: o1.metadata.label ? o1.metadata.label : o1.value + '',
                                    parent: parent ? parent.id : null
                                };
                              } else if (_.isObject(o.value)) {
                                // var o = extractObject(n.value);
                                var object = {
                                    cid: o.cid,
                                    rid: o.rid,
                                    metadata: o.metadata,
                                    id: (o.value + '_as_parent').replace(/\s/g, ''),
                                    name: o.metadata.label ? o.metadata.label : o.value + '',
                                    parent: parent ? parent.id : null
                                };
                              } else {
                                var object = {
                                    cid: o.cid,
                                    rid: o.rid,
                                    metadata: o.metadata,
                                    id: (o.value + '').replace(/\s/g, ''),
                                    name: o.metadata.label ? o.metadata.label : o.value + '',
                                    parent: parent ? parent.id : null
                                };
                              }

                              if (_.isArray(p.value)) {
                                var p1 = extractPredicate(p.value);
                                var edge = {
                                  group: "edges",
                                  data:
                                  {
                                    cid: p1.cid,
                                    rid: p1.rid,
                                    metadata: p1.metadata,
                                    id: ( subject.id + object.id ).replace(/\s/g, ''),
                                    source: (subject.id).replace(/\s/g, ''),
                                    target: (object.id).replace(/\s/g, ''),
                                    name: p1.metadata.label ? p1.metadata.label : p1.value
                                  }
                                }
                              } else {
                                var edge = {
                                  group: "edges",
                                  data:
                                  {
                                    cid: p.cid,
                                    rid: p.rid,
                                    metadata: p.metadata,
                                    id: ( subject.id + object.id ).replace(/\s/g, ''),
                                    source: (subject.id).replace(/\s/g, ''),
                                    target: (object.id).replace(/\s/g, ''),
                                    name: p.metadata.label ? p.metadata.label : p.value
                                  }
                                };
                              }

                              newEdge.push(edge);
                              newNode.push(subject, object);

                              if (_.isArray(s.value)) {
                                _.forEach(s.value, function(n) {
                                  extractEntity(n, subject);
                                });
                              };

                              if (_.isArray(o.value)) {
                                _.forEach(o.value, function(n) {
                                  extractEntity(n, object);
                                });
                              };

                              // if (_.isArray(p.value)) {
                              //   _.forEach(p.value, function(n) {
                              //     extractEntity(n, object);
                              //   });
                              // };

                              // if (_.isArray(s.value)) {
                              //   _.forEach(s.value, function(n) {
                              //     extractEntity(n, subject);
                              //   });
                              // };
                              //
                              // if (_.isArray(o.value)) {
                              //   _.forEach(o.value, function(n) {
                              //     extractEntity(n, object);
                              //   });
                              // };
                            }
                            extractEntity(n);
                          });

                          var filterNode = [];
                          _.forEach(_.uniqBy(newNode, 'id'), function(n) {
                            filterNode.push({
                              group: 'nodes',
                              data: n,
                              position: {
                                x: 100 + Math.random() * 100,
                                y: 100 + Math.random() * 100
                              }
                            });
                          });

                          var n = cy.add(filterNode);
                          var e = cy.add(newEdge);

                          nodeTipExtension(n);
                          edgeTipExtension(e);

                          scope.data.nodes = _.union(nodes, filterNode);
                          scope.data.edges = _.union(edges, newEdge);
                          cy.layout(scope.options.layout).run();
                        }
                      });
                      // ;
                      if (!$rootScope.$$listenerCount.addEdge) {
                        if ($rootScope.$$listenerCount.addEdge === 1) {
                          $rootScope.$$listenerCount.addEdge = 0;
                          // ;
                          return;
                        } else {
                          $rootScope.$on('addEdge', function(e){
                            ;
                            eh.enabled = true;
                            // eh.active = true;
                            var nodeId = scope.selectedEntity.data('id');
                            console.log(nodeId);
                            // ;
                            // console.log(eh.listeners);
                            // console.log(cy.$('#' + nodeId));
                            if (eh.listeners.length === 0) {
                              eh.addCytoscapeListeners();
                              // eh.listeners = scope.ehListeners;
                            }
                            // scope.ehListeners = eh.listeners;
                            eh.start( cy.$('#' + nodeId) );
                          });
                        }
                      }

                      // scope.$parent.progressBarIsInactive = true;
                      // scope.progressBarIsInactive = true;

                      $rootScope.$on('deleteEntity', function(){
                        if (cy.$(":selected").length > 0) {
                            cy.$(":selected").remove();
                        }
                      });

                      $rootScope.$on('createCompound', function() {
                        var newCompound = angular.element('#newCompound').val();
                        var ns = cy.$(':selected');
                        const timestamp = Date.now();

                        // var hasParent = _.find(ns, function(n){ if (n.parent().id()) { return n; } });
                        // if (hasParent) {
                        //   //scope.newCompound.move({parent: hasParent.parent().id()});
                        //   var nodeObj = {
                        //       data: {
                        //         id: newCompound + timestamp,
                        //         name: newCompound,
                        //         parent: hasParent.parent().id()
                        //       },
                        //       position: {
                        //         x: ns[0].position().x,
                        //         y: ns[0].position().y
                        //       }
                        //   };
                        // } else {
                          var nodeObj = {
                              data: {
                                id: newCompound + timestamp,
                                name: newCompound
                              },
                              position: {
                                x: ns[0].position().x,
                                y: ns[0].position().y
                              }
                          };
                        // }
                        scope.newCompound = cy.add(nodeObj);
                        scope.data.nodes.push(nodeObj);

                        _.forEach(ns, function(n) {
                          n.data().parent = scope.newCompound.data('id');
                        });
                        cy.elements().remove();
                        cy.add(scope.data);
                        cy.nodes().forEach(function(n){
                          nodeTipExtension(n);
                        });
                        cy.edges().forEach(function(e) {
                          edgeTipExtension(e);
                        });

                        nodeTipExtension(scope.newCompound);
                        cy.layout({name: 'cose-bilkent'}).run();
                        cy.fit();
                      });

                      $rootScope.$on('layoutReset', function(){
                          cy.layout(scope.options.layout).run();
                      });

                      $rootScope.$on('centerGraph', function(){
                          cy.fit();
                      });


                      $rootScope.$on('mergeToParent', function() {
                          scope.selectedNodesToMerge = cy.$(':selected');
                          // var descendants = selectedNodesToParent.descendants();
                          if (!scope.mergeMode) {
                            scope.mergeMode = true;
                          } else {

                          }
                      });
                    }; // end doCy()

                  setTimeout( function() {
                    scope.doCy();
                  }, 500);


                  // Attach an event handler if defined
                  angular.forEach(scope.events, function (callback, event) {
                      if (networkEvents.indexOf(String(event)) >= 0) {
                          cy.on(event, callback);
                      }
                  });

                  // onLoad callback
                  if (scope.events != null && scope.events.onload != null &&
                      angular.isFunction(scope.events.onload)) {
                      scope.events.onload(cy);
                  }

                  // When the app object changed = redraw the graph
                  // you can use it to pass data to be added or removed from the object without redrawing it
                  // using cy.remove() / cy.add()
                  $rootScope.$on('appChanged', function(){
                      scope.doCy();
                  });

                  $(document).on('click', "#editNode", function(event, n){
                    scope.$parent.EntityService.openSideNav(scope.selectedEntity);
                  });

                  $(document).on('click', "#editEdge", function(event, e) {
                    scope.$parent.EntityService.openSideNav(scope.selectedEntity);
                  });

                  $(document).on('click', "#addEdge", function(e){
                    scope.$parent.$mdToast.show(
                          scope.$parent.$mdToast.simple()
                            .textContent('Select a target node to draw a relation')
                            .position('top right')
                            .theme("primary-toast")
                            .hideDelay(3500)
                        );
                    $rootScope.$broadcast('addEdge');
                  });

                  $(document).on('click', "#moveNode", function(event, n){
                    // scope.$parent.EntityService.openSideNav(scope.selectedEntity);
                    if (cy.$(':selected').length > 0) {
                      scope.$parent.$mdToast.show(
                            scope.$parent.$mdToast.simple()
                              .textContent('Please select the target node to merge')
                              .position('top right')
                              .theme("primary-toast")
                              .hideDelay(3500)
                          );
                      $rootScope.$emit('mergeToParent');
                    }
                  });

                });

            }
        };
    });
});
