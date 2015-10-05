define([
     'connecta.portal',
     'portal/layout/service/sidebar'
], function(portal) {
     /**
      * Componente usado para renderizar e manter o sidebar
      * @param {type} applicationsService
      */
     return portal.directive('sidebar', function() {
          return {
               replace: true,
               templateUrl: 'app/portal/layout/directive/template/sidebar.html',
               controller: function($scope, $timeout) {
                    $scope.sidebar = {
                         controller: function($scope) {
                         },
                         src: '',
                         mini:false
                    };
                    
                    $scope.toggleMiniBar = function(){
                        $scope.sidebar.mini=!$scope.sidebar.mini;
                        $scope.$broadcast('sidebar.mini', $scope.sidebar.mini);
                    };
                    
                    $scope.$on('sidebar.config', function(event, sidebar) {
                         $scope.sidebar.controller = null;
                         $timeout(function() {
                              $scope.sidebar = sidebar;
                         });
                    });
               }
          };
     });
});
