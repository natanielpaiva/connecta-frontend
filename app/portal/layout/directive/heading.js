define([
  'connecta.portal'
], function(portal) {
  /**
   * Componente usado para renderizar e manter o header do portal
   */
  return portal.directive('heading', function(LayoutService, applicationsService) {
    return {
      restrict: 'E',
      templateUrl: 'app/portal/layout/directive/template/heading.html',
      controller: function($scope, applications) {
        // adiciona a lista de aplicações no escopo
        $scope.applications = applications;
        /**
         * Oculta e exibe a barra lateral
         *
         * @returns {undefined}
         */
        $scope.toggleSidebar = function() {
          LayoutService.toggleSidebar();
        };
        // /**
        //  * Oculta e exibe a lista de páginas abertas
        //  *
        //  * @returns {undefined}
        //  */
        // $scope.togglePageTabs = function() {
        //   LayoutService.togglePageTabs();
        //   return false;
        // };
        // // Evento ao atualizar a aplicação em execução
        // $scope.$on('applications.change', function(event) {
        //   // Adiciona os estilos personalizados da aplicação atual
        //   var appInstance = applicationsService.getInstance();
        //   scope.appInstance = appInstance;
        // });
      }
    };
  });
});
