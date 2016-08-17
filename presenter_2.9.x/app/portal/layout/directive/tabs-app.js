/**
 * Permite organizar as páginas abertas por aplicação
 */
define([
    'connecta.portal'
], function (portal) {
    return portal.directive('appPagesTabsApp', function (pageService) {
        function parsePageHistory() {
            var pageHistory = pageService.getPageHistory();

            //organiza a lista de tabs por aplicação
            var appPages = {};
            for (var a = 0; a < pageHistory.length; a++) {
                var page = pageHistory[a];
                if (!appPages[page.application.name]) {
                    appPages[page.application.name] = [];
                }

                var pages = appPages[page.application.name];
                if (pages.indexOf(page) === -1) {
                    pages.push(page);
                }
            }
            return appPages;
        }
        
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'app/portal/layout/directive/template/tabs-app.html',
            scope: {
                page: '='
            },
            link: function (scope, element) {

                scope.pageHistory = parsePageHistory();

                scope.$on('page.change', function () {
                    scope.pageHistory = parsePageHistory();
                });

                scope.$on('page.remove', function () {
                    scope.pageHistory = parsePageHistory();
                });

                // barra de rolagem da lista de páginas
                var eleHeight = window.screen.height;
                eleHeight = eleHeight - (eleHeight * 22.5 / 100);
                $('> ul', element).slimScroll({
                    color: '#a1b2bd',
                    size: '4px',
                    height: eleHeight,
                    alwaysVisible: false
                });
            }
        };
    });
});