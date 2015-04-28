define([
    'connecta.portal',
    'portal/layout/directive/heading',
    'portal/layout/directive/menu',
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
                $scope.showSidebar = layoutService.isSidebarVisible();
                /**
                 * Evento para exibir a barra lateral
                 */
                $scope.$on('menu.show', function () {
                    $scope.showSidebar = true;
                });

                /**
                 * Evento para ocultar a barra lateral
                 */
                $scope.$on('menu.hide', function () {
                    $scope.showSidebar = false;
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

