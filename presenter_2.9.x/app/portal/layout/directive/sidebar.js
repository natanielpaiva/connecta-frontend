define([
     'connecta.portal',
     'portal/layout/service/sidebar'
], function(portal) {
     /**
      * Componente usado para renderizar e manter o sidebar
      */
     return portal.directive('sidebar', function() {
          return {
               replace: true,
               templateUrl: 'app/portal/layout/directive/template/sidebar.html',
               controller: function($scope, $timeout, SidebarService) {
                    $scope.mini = SidebarService.isSidebarMini();
                    
                    $scope.sidebar = {
                         controller:function(){},
                         src: ''
                    };
                    
                    $scope.toggleMini = function(){
                        SidebarService.toggleMini($scope.mini);
                    };
                    
                    $scope.$on('sidebar.config', function(event, sidebar) {
                         $scope.sidebar.controller = null;
                         $timeout(function() {
                              $scope.sidebar = sidebar;
                         });
                    });
                    
                    $scope.$on('sidebar.mini', function(event, mini){
                        $scope.mini = mini;
                    });
               }
          };
     });
});
