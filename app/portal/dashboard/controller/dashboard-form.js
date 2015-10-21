/* global angular */
define([
  'connecta.portal',
  'portal/dashboard/service/dashboard-service',
  'portal/dashboard/directive/viewer',
  'presenter/viewer/directive/analysis-viewer',
  'presenter/viewer/directive/singlesource-viewer',
  'presenter/viewer/directive/singlesource-group-viewer',
  'presenter/viewer/directive/combined-viewer'
], function(portal) {
  return portal.lazy.controller('DashboardFormController', function(
      $scope, DashboardService, $routeParams, $location, $filter, SidebarService, applications, $modal) {
    $scope.dashboard = {};
    
    var _sectionTemplate = {
      name: $filter('translate')('DASHBOARD.NEW_SECTION'),
      items: [],
      active: true
    };

    SidebarService.config({
      controller: function ($scope) {
        $scope.applications = applications;
        
        $scope.search = {
          terms: "",
          results:[]
        };
        
        $scope.search.doSearch = function(){
          DashboardService.searchViewers($scope.search.terms).then(function(response){
            angular.forEach(response.data, function(obj){
              var viewerPath = applications[obj.module].host +
                      applications[obj.module].viewerPath;
              obj.viewerUrl = viewerPath.replace(':id', obj.id);
              delete obj.id;
            });
            
            $scope.search.results = response.data;
          });
        };
        
        $scope.$watch('search.terms', function(){
          $scope.search.doSearch();
        });
        
      },
      src: 'app/portal/dashboard/template/_dashboard-form-viewer-search.html'
    }).show();

    $scope.$on('$locationChangeStart', function() {
      
      SidebarService.hide();
    });

    if ($routeParams.id) {
      DashboardService.get($routeParams.id).then(function(response) {
        response.data.sections.sort(function(a, b) {
          a.draggable =  {
            enabled: true
          };
          a.resizable =  {
            enabled: true
          };
          
          return a.order - b.order;
        });
        response.data.sections[0].active = true;

        $scope.dashboard = response.data;
      });
    } else {
      var section = angular.copy(_sectionTemplate);
      section.order = 0;
      $scope.dashboard = {
        sections: [
          section
        ],
        displayMode:'VERTICAL'
      };
    }
    
    $scope.gridsterOpts = {
        columns: 6, // the width of the grid, in columns
        pushing: true, // whether to push other items out of the way on move or resize
        floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        minSizeX: 1, // minimum column width of an item
        maxSizeX: null, // maximum column width of an item
        minSizeY: 1, // minumum row height of an item
        maxSizeY: null, // maximum row height of an item
        resizable: {
           enabled: true,
           handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
           start: function(event, $element, widget) {}, // optional callback fired when resize is started,
           resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
           stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
        },
        draggable: {
           enabled: true, // whether dragging items is supported
           handle: '.my-class', // optional selector for resize handle
           start: function(event, $element, widget) {}, // optional callback fired when drag is started,
           drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
           stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        }
    };

    /**
     * Configuração dos itens do gridster de todas as seções
     */
    $scope.gridsterItemConfig = {
      sizeX: 'item.sizeX',
      sizeY: 'item.sizeY',
      row: 'item.row',
      col: 'item.column'
    };
    

    $scope.addSection = function() {
      if ($scope.dashboard.sections) {
        var section = angular.copy(_sectionTemplate);
        section.order = $scope.dashboard.sections.length;
        $scope.dashboard.sections.push(section);
      }
    };
    
    $scope.renameSection = function($event, section, edit) {
      $event.preventDefault();
      section.edit = edit;
    };

    $scope.removeSection = function($event, section) {
      $event.preventDefault();
      $scope.dashboard.sections.splice(
        $scope.dashboard.sections.indexOf(section), 1
      );
    };

    $scope.remove = function(item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $scope.add = function() {
      $scope.items.push({
        sizeX: 2,
        sizeY: 1,
        row: 0,
        col: 0
      });
    };
    
    $scope.config = function () {
      var $parentScope = $scope;
      $modal.open({
        animation: true,
        templateUrl: 'app/portal/dashboard/template/_dashboard-form-config.html',
        controller: function($scope){
          $scope.dashboard = $parentScope.dashboard;
          
          $scope.displayModes = [
            'VERTICAL', 'HORIZONTAL'
          ];
          
          $scope.animations = [
            'FADE',
            'SLIDE_UP',
            'SLIDE_DOWN',
            'SLIDE_RIGHT',
            'SLIDE_LEFT'
          ];
        },
        size: 'lg'
      });
    };

    $scope.save = function() {
      DashboardService.save($scope.dashboard).then(function(response) {
        $location.path('dashboard/' + response.data.id);
      });
    };
  });
});
