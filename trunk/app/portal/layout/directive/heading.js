define([
  'angular',
  'connecta.portal',
  'portal/auth/service/login-service'
], function(angular, portal) {
  /**
   * Componente usado para renderizar e manter o header do portal
   */
  return portal.directive('heading', function(LayoutService, LoginService) {
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
        
        $scope.$on('login.authenticated', function($event, isAuthenticated){
          if (isAuthenticated) {
            LoginService.getCurrentUser().then(function(user){
              $scope.user = user;
            });
          }
        });
        
        LoginService.checkAuthentication();

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
