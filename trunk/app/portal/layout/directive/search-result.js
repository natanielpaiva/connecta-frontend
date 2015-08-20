define([
    'connecta.portal',
    'text!portal/layout/directive/template/search-result-body-table.html',
    'text!portal/layout/directive/template/search-result-body-list.html'
], function(portal, templateTable, templateList) {
    /**
     * Componente para a busca padronizada de itens
     */
    return portal.directive('appSearchResultBody', function($compile) {
        return {
            scope: {
                results: '=',
                config: '='
            },
            restrict: 'A',
            replace: true,
            link: function(scope, element) {
                var template = '';

                if (scope.config && scope.config.templateContent) {
                    // verifica se é uma listagem de tabela ou nao
                    if (!scope.config.template || scope.config.template === '') {
                        var tableHeaders = [
                        ];

                        for (var a in scope.config.tableParams) {
                            if (!scope.config.tableParams.hasOwnProperty(a)) {
                                continue;
                            }
                            tableHeaders.push(scope.config.tableParams[a].title);
                        }
                        scope.headers = tableHeaders;
                        template = templateTable;
                    } else {
                        template = templateList;
                    }

                    template = template.replace(/__TEMPLATE__/g, scope.config.templateContent);
                    element.html(template).show();
                    $compile(element.contents())(scope);
                }

                scope.$watch('results', function(newValue) {
                    // ???
                });
            }
        };
    });
});
