define([
    'connecta.portal',
    'portal/layout/directive/heading',
    'portal/layout/directive/menu',
    'portal/layout/directive/sidebar',
    'portal/layout/service/layout'
], function (portal) {
    /**
     * Componente usado para renderizar e manter o layout do portal
     *
     * @returns {undefined}
     */
    return portal.directive('layout', function () {
        return {
            restrict: 'AE',
            replace: true,
            templateUrl: 'app/portal/layout/directive/template/layout.html',
            controller: function ($scope, LayoutService, SidebarService) {
                $scope.showAsFlat = false;
                $scope.fullscreen = false;
                $scope.showMenu = LayoutService.isMenuVisible();
                $scope.showSidebar = false;
                $scope.sidebarMini = SidebarService.isSidebarMini();
                $scope.authenticated = false;
                $scope.showHeading = true;

                /**
                 * Evento para exibir o menu
                 */
                $scope.$on('menu.mini', function (ev, show) {
                    $scope.showMenu = show;
                });
                /**
                 * Evento para mostrar o form de login
                 */
                $scope.$on('login.authenticated', function (ev, authenticated) {
                    $scope.authenticated = authenticated;
                });
                /**
                 * Evento para esconder o header
                 */
                $scope.$on('heading.show', function (ev, show) {
                    $scope.showHeading = show;
                });
                /**
                 * Evento para mostrar a barra lateral
                 */
                $scope.$on('sidebar.show', function (ev, val) {
                    $scope.showSidebar = val;
                });
                /**
                 * Evento para minimizar a barra lateral
                 */
                $scope.$on('sidebar.mini', function (ev, val) {
                    $scope.sidebarMini = val;
                });
                /**
                 * Evento para mostrar o page container sem fundo
                 * e sem padding
                 */
                $scope.$on('page.flat', function (ev, val) {
                    $scope.showAsFlat = val;
                });
                /**
                 * Evento para mostrar o page container sem fundo
                 * e sem padding
                 */
                $scope.$on('page.fullscreen', function (ev, val) {
                    $scope.fullscreen = val;
                });
            }
        };
    });
});
