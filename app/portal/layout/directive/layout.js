define([
    'connecta.portal',
    'portal/layout/directive/heading',
    'portal/layout/directive/menu',
    'portal/layout/directive/sidebar',
    'portal/layout/directive/pages',
    'portal/layout/directive/search-embedded',
    'portal/layout/service/layout'
], function (portal) {
    /**
     * Componente usado para renderizar e manter o header do portal
     *
     * @returns {undefined}
     */
    return portal.directive('appLayout', function () {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/portal/layout/directive/template/layout.html',
            controller:function($scope, layoutService) {
                $scope.showAsFlat = false;
                $scope.showSidebar = layoutService.isSidebarVisible();
                $scope.showSidebarRight = false;
                /**
                 * Evento para exibir a barra lateral
                 */
                $scope.$on('menu.show', function () {
                    $scope.showSidebar = true;
                });
                
                $scope.$on('sidebarRight.show', function (ev, val) {
                    $scope.showSidebarRight = val;
                });

                /**
                 * Evento para ocultar a barra lateral
                 */
                $scope.$on('menu.hide', function () {
                    $scope.showSidebar = false;
                });
                
                /**
                 * Evento para mostrar o page container sem fundo
                 * e sem padding
                 */
                $scope.$on('page.flat', function (ev, val) {
                    $scope.showAsFlat = val;
                });
            },
            link: function (scope, element) {
                /**
                 * Evento para ocultar a lista de tabs
                 */
                scope.$on('page.hideTabs', function () {
                    element.removeClass('show-tabs');
                });

                /**
                 * Evento para exibir a lista de tabs
                 */
                scope.$on('page.showTabs', function () {
                    element.addClass('show-tabs');
                });
            }
        };
    });
});
