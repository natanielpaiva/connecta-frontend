define([
  'connecta.portal',
  'portal/layout/directive/heading',
  'portal/layout/directive/menu',
  'portal/layout/directive/sidebar',
  'portal/layout/directive/pages',
  'portal/layout/directive/search-embedded',
  'portal/layout/service/layout'
], function(portal) {
  /**
   * Componente usado para renderizar e manter o header do portal
   *
   * @returns {undefined}
   */
  return portal.directive('layout', function() {
    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'app/portal/layout/directive/template/layout.html',
      controller: function($scope, LayoutService, SidebarService) {
        $scope.showAsFlat = false;
        $scope.fullscreen = false;
        $scope.showMenu = LayoutService.isMenuVisible();
        $scope.showSidebar = false;
        $scope.sidebarMini = SidebarService.isSidebarMini();
        $scope.authenticated = false;

        /**
         * Evento para exibir o menu
         */
        $scope.$on('menu.show', function() {
          $scope.showMenu = true;
        });
        /**
         * Evento para ocultar o menu
         * TODO Remover esse e receber o boolean pelo evento
         */
        $scope.$on('menu.hide', function() {
          $scope.showMenu = false;
        });
        /**
         * Evento para mostrar o form de login
         */
        $scope.$on('login.authenticated', function($event, authenticated) {
          $scope.authenticated = authenticated;
        });
        /**
         * Evento para mostrar a barra lateral
         */
        $scope.$on('sidebar.show', function(ev, val) {
          $scope.showSidebar = val;
        });
        /**
         * Evento para minimizar a barra lateral
         */
        $scope.$on('sidebar.mini', function(ev, val) {
          $scope.sidebarMini = val;
        });
        /**
         * Evento para mostrar o page container sem fundo
         * e sem padding
         */
        $scope.$on('page.flat', function(ev, val) {
          $scope.showAsFlat = val;
        });
        /**
         * Evento para mostrar o page container sem fundo
         * e sem padding
         */
        $scope.$on('page.fullscreen', function(ev, val) {
          $scope.fullscreen = val;
        });
      }
    };
  });
});
