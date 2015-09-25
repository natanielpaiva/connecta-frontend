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
      controller: function($scope, $timeout, applications) {

        $scope.user = {};
        $scope.avatarUrl = null;

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
              $scope.getUserAvatarUrl();
            });
          }
        });

        LoginService.checkAuthentication();

        $scope.getUserAvatarUrl = function(){
          var avatarUrl = $scope.user.avatarUrl;
          var avatarUrlType = $scope.user.avatarUrlType;

          if(avatarUrlType === 'DATABASE'){
            $scope.avatarUrl = avatarUrl + '?_=' + new Date().getTime();
          } else {
            $scope.avatarUrl = avatarUrl;
          }

        };

        $scope.logoutUser = function(){
          LoginService.unauthenticate();
        };

        $scope.closePopOver = function(){
          HeadingPopoverService.hide();
        };

        $scope.toggleAppsPopOver = function(){
          $scope.appsPopoverFocus = true;
          var popoverOptions = {
            id: 'appsPopOver',
            templateurl: 'heading-popover-apps.html',
            controller: function($scope){
              $scope.applications = _mapToArray(applications);
            },
            close: function(){
              $scope.appsPopoverFocus = false;
            }
          };

          HeadingPopoverService.active(popoverOptions);
        };

        $scope.toggleUserPopOver = function(){
          $scope.userPopoverFocus = true;
          var popoverOptions = {
            id: 'userPopOver',
            templateurl: 'heading-popover-user.html',
            controller: function($scope){
              $scope.applications = _mapToArray(applications);
            },
            close: function(){
              $scope.userPopoverFocus = false;
            }
          };

          HeadingPopoverService.active(popoverOptions);
        };


        $scope.toggleNotificationsPopOver = function(){
          $scope.notificationPopoverFocus = true;
          var popoverOptions = {
            id: 'notificationsPopOver',
            templateurl: 'heading-popover-notifications.html',
            controller: function($scope){
            },
            close: function(){
              $scope.notificationPopoverFocus = false;
            }
          };

          HeadingPopoverService.active(popoverOptions);
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

        $scope.$on('user.refresh.done', function($event, user){
          $scope.user = user;
          $scope.getUserAvatarUrl();
        });
      }
    };
  });
});