define([
  'connecta.portal'
], function (portal) {
  return portal.lazy.controller('DashboardController', function ($scope, layoutService) {
    layoutService.showAsFlat(true);

    $scope.config = {
      // columns: 12,
      // resizable: {
      //   enabled: false
      // },
      // draggable: {
      //   enabled: false
      // }
    };

    $scope.$on("$locationChangeStart", function(event) {
      layoutService.showAsFlat(false);
    });

    $scope.items = [
      { sizeX: 2, sizeY: 1, row: 0, col: 0 },
      { sizeX: 2, sizeY: 2, row: 0, col: 2 },
      { sizeX: 1, sizeY: 1, row: 0, col: 4 },
      { sizeX: 1, sizeY: 1, row: 0, col: 5 },
      { sizeX: 2, sizeY: 1, row: 1, col: 0 },
      { sizeX: 1, sizeY: 1, row: 1, col: 4 },
      { sizeX: 1, sizeY: 2, row: 1, col: 5 },
      { sizeX: 1, sizeY: 1, row: 2, col: 0 },
      { sizeX: 2, sizeY: 1, row: 2, col: 1 },
      { sizeX: 1, sizeY: 1, row: 2, col: 3 },
      { sizeX: 1, sizeY: 1, row: 2, col: 4 }
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
