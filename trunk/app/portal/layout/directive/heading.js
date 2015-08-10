define([
  'connecta.portal'
], function(portal) {
  /**
   * Componente usado para renderizar e manter o header do portal
   */
  return portal.directive('heading', function(LayoutService) {
    return {
      restrict: 'E',
      templateUrl: 'app/portal/layout/directive/template/heading.html',
      controller: function($scope, applications) {
        function _mapToArray(map) {
          var array = [];
          angular.forEach(map, function(value,key){
            value.id = key;
            array.push(value);
          });
          return array;
        }
        // adiciona a lista de aplicações no escopo
        $scope.applications = _mapToArray(applications);

        $scope.showApps = false;
        $scope.toggleApps = function(){
          $scope.showApps = !$scope.showApps;
        };
        /**
         * Oculta e exibe a barra lateral
         *
         * @returns {undefined}
         */
        $scope.toggleSidebar = function() {
          LayoutService.toggleSidebar();
        };

        $scope.shownModules = function(obj){
          return obj.hide ? false : true;
        };
      }
    };
  });
});
