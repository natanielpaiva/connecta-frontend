/**
 * Permite organizar as páginas abertas por aplicação
 */
define([
    'connecta.portal',
    'portal/layout/directive/tabs-app',
    'portal/layout/directive/tabs-history'
], function(portal) {
    return portal.directive('appPagesTabs', function() {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/portal/layout/directive/template/tabs.html',
            scope: {
                page: '='
            },
            link: function(scope) {

                scope.listTabsAsHistory = false;
                scope.showTabs = false;


                /**
                 * Evento para exibir a listagem de páginas abertas
                 *
                 * Computa as páginas abertas e exibe-as
                 */
                scope.$on('page.showTabs', function() {
                    scope.showTabs = true;
                });

                /**
                 * Evento para ocultar a listagem de páginas abertas
                 */
                scope.$on('page.hideTabs', function() {
                    scope.showTabs = false;
                });
            }
        };
    });
});