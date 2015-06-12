define([
  'connecta.portal'
], function (portal) {
  return portal.lazy.controller('DashboardController', function ($scope, layoutService) {
    layoutService.showAsFlat(true);

    $scope.$on("$locationChangeStart", function(event) {
      layoutService.showAsFlat(false);
    });

    $scope.config = {
      draggable: {
        enabled:true
      },
      resizable: {
        enabled:true
      }
    };

    // $scope.focus = function($event){
    //   angular.element($event.target).parent('[redactor]').focus();
    // };

    var disableDragResize = function() {
      $scope.config.draggable.enabled = false;
      $scope.config.resizable.enabled = false;
    };

    var enableDragResize = function() {
      $scope.config.draggable.enabled = true;
      $scope.config.resizable.enabled = true;
    };

    $scope.edit = function(){

    };

    $scope.items = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 },
      { sizeX: 1, sizeY: 1, row: 0, col: 4 },
      { sizeX: 1, sizeY: 1, row: 0, col: 5 },
      { sizeX: 2, sizeY: 1, row: 1, col: 0 },
      { sizeX: 1, sizeY: 1, row: 1, col: 4 },
      { sizeX: 1, sizeY: 1, row: 1, col: 5 }
    ];

    $scope.add = function(){
      $scope.items.push({
        sizeX: 2, sizeY: 1, row: 0, col: 0
      });
    };

    $scope.remove = function(item){
      $scope.items.splice($scope.items.indexOf(item), 1);
    };
  });
});
