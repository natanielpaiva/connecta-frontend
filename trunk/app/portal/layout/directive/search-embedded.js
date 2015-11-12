define([
    'connecta.portal',
    'text!portal/layout/directive/template/search-embedded.html',
    'portal/layout/filter/map-from',
    'portal/layout/controller/search'
], function(portal, template) {
    // FIXME Não precisa fazer essa farofada no Angular. Melhorar essa diretiva
    var $template = $(template);

    /**
     * Componente para a busca padronizada de itens
     */
    return portal.directive('appSearchEmbedded', function($compile, $location, searchService, pageService) {
        return {
            restrict: 'A',
            replace: true,
            // Haja go horse
            template: '<div class="app-search"></div>',
            scope: {},
            link: function($scope, element, attrs) {

                // exibe o buscador
                $scope.$on('search.show', function() {
                    $('body').addClass('show-app-search');
                    // Cria um novo escopo para a controller
                    var scope = $scope.$new();

                    // oculta o buscador e destroy este scopo
                    scope.closeSearch = function() {
                        searchService.hide();
                        pageService.back();
                        scope.$destroy();
                        return false;
                    };

                    // transforma o buscador em uma página fixa
                    scope.fixSearch = function(href) {
                        scope.closeSearch();
                        $location.path(href);
                        return false;
                    };

                    $(element).empty();
                    $(element).html($compile($template)(scope));
                });

                // oculta o buscador
                $scope.$on('search.hide', function() {
                    $('body').removeClass('show-app-search search-advanced');
                });
            }
        };
    });
});

