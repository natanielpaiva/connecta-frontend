define([
  'angular',
  'connecta.portal',
  'portal/auth/service/login-service',
  'portal/layout/service/heading-popover-service'
], function(angular, portal) {
  /**
   * Componente usado para renderizar e manter o header do portal
   */
  return portal.directive('heading', function(LayoutService, LoginService, HeadingPopoverService) {
    return {
      restrict: 'E',
      templateUrl: 'app/portal/layout/directive/template/heading.html',
      controller: function($scope, applications) {
        var controller = this;

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

        $scope.toggleAppsPopOver = function(){
          var popoverOptions = {
            id: 'appsPopOver',
            templateurl: 'app/portal/layout/template/heading-popover-apps.html',
            controller: function($scope){
              $scope.applications = _mapToArray(applications);
            }
          };

          HeadingPopoverService.active(popoverOptions);
        };

        $scope.closePopOver = function(){
          HeadingPopoverService.hide();
        };

        $scope.toggleUserPopOver = function(){
          var popoverOptions = {
            id: 'userPopOver',
            templateurl: 'app/portal/layout/template/heading-popover-user.html',
            controller: function($scope){
              $scope.applications = _mapToArray(applications);
            }
          };

          HeadingPopoverService.active(popoverOptions);
        };

        $scope.logoutUser = function(){
          LoginService.unauthenticate();
        };

        $scope.toggleNotifications = function(){
          $scope.showNotifications = !$scope.showNotifications;
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

        $scope.$on('heading.change-logo', function($event, logoSrc){
          $scope.logoSrc = logoSrc+"?_="+new Date().getTime();
        });

        $scope.$on('heading.remove-logo', function($event, logoSrc){
          $scope.logoSrc = null;
        });
      }
    };
  });
});
