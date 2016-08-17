define([
    'connecta',
    'text!portal/layout/template/page.html',
    'portal/layout/controller/page'
], function(connecta, pageTemplate) {

    function PagesHistory() {
        var history = [];

        this.add = function(page) {
            // atualiza historico de uso de página
            if (history.indexOf(page) >= 0) {
                history.splice(history.indexOf(page), 1);
            }
            history.push(page);
        };

        this.getHistory = function() {
            return ([]).concat(history).reverse();
        };

        this.pop = function() {
            return history.pop();
        };

        this.remove = function(page) {
            if (history.indexOf(page) >= 0) {
                history.splice(history.indexOf(page), 1);
            }
        };
    }

    /**
     * Serviço de gerenciamento das páginas abertas no portal
     */
    return connecta.factory('pageService', [
        '$q',
        '$rootScope',
        '$location',
        'applicationsService',
        function($q, $rootScope, $location, applicationsService) {

            var actualPage = null;
            var pagesHistory = new PagesHistory();

            var pageService = {
                /**
                 * Obtém a instancia da página que está sendo exibida
                 *
                 * @returns {Object}
                 */
                getPage: function() {
                    return actualPage;
                },
                /**
                 * Obtém a lista de paginas abertas
                 *
                 * @returns {undefined}
                 */
                getPageHistory: function() {
                    return pagesHistory.getHistory();
                },
                /**
                 * Remove uma página aberta
                 *
                 * @param {type} page
                 * @returns {undefined}
                 */
                removePage: function(page) {
                    pagesHistory.remove(page);
                    $rootScope.$broadcast('page.remove');
                },
                /**
                 * Permite voltar a página aberta anteriormente
                 *
                 * @param {type} page
                 * @returns {undefined}
                 */
                back: function() {
                    var last = pagesHistory.pop();
                    if (actualPage && actualPage === last) {
                        var last2 = pagesHistory.pop();
                        if (last2) {
                            pagesHistory.add(last);
                            last = last2;
                        } else {
                            last = null;
                        }
                    }

                    if (last) {
                        pageService.setPage(last);
                    } else {
                        $location.path('');
                    }
                },
                /**
                 * Seta a instancia de página que está sendo exibida
                 *
                 * @param {Object} page
                 * @returns {undefined}
                 */
                setPage: function(page) {
                    actualPage = page;
                    actualPage.changeAt = Date.now();
                    pagesHistory.add(actualPage);
                    $location.path(actualPage.url);
                    applicationsService.setInstance(actualPage.application.name);
                    $rootScope.$broadcast('page.change');
                },
                /**
                 * Faz o tratamento necessário para a criação de uma instancia de página
                 *
                 * @param {String} application O nome da aplicação
                 * @param {String} template O template para execução da página
                 * @param {String} url A url da página
                 * @param {Object} vars Variáveis que serão adicionadas no scopo
                 * de execução da página, por exemplo id.
                 * @param {String} title O título da página
                 * @param {String} subTitle O subTitulo da página
                 * @returns {$q.promise}
                 */
                resolve: function(application, template, url, vars, title, subTitle) {
                    var defer = $q.defer();
                    var app = applicationsService.get(application);
                    app.then(function(appConfig) {
                        console.log('vars', vars);
                        var page = {
                            application: appConfig,
                            template: pageTemplate.replace(/__PAGE_CONTENT__/g, template),
                            url: url,
                            title: title,
                            subTitle: subTitle,
                            showTitle: (title && title !== ''),
                            // o html já renderizado desta página
                            html: null,
                            /**
                             * Permite definir a página como ativa
                             *
                             * @returns {undefined}
                             */
                            restore: function() {
                                pageService.setPage(page);
                            },
                            /**
                             * Permite destruir a instancia da página
                             *
                             * @returns {undefined}
                             */
                            destroy: function() {
                                pageService.removePage(page);
                                page.scope.$destroy();
                            }
                        };

                        /**
                         * cria um escopo para a página
                         */
                        page.scope = (function() {
                            var scope = $rootScope.$new(true);

                            // Adiciona as variáveis de scopo
                            if (vars && typeof vars === 'object') {
                                for (var a in vars) {
                                    if (!vars.hasOwnProperty(a)) {
                                        continue;
                                    }
                                    scope[a] = vars[a];
                                }
                            }

                            scope.page = page;
                            return scope;
                        })();

                        // define como a atual
                        actualPage = page;

                        // informa a instancia da aplicação sendo executada
                        applicationsService.setInstance(application);

                        // informa a página exibida no momento
                        defer.resolve();

                        //exibe a página
                        pageService.setPage(actualPage);
                    });
                    return defer.promise;
                },
                /**
                 * Verifica se a url está sendo exibida neste exato momento,
                 * usado para evitar a inclusão desncessário de novas páginas
                 * na listagem
                 *
                 * @param {String} url
                 * @returns {Boolean}
                 */
                isShowing: function(url) {
                    if (!actualPage) {
                        return false;
                    }

                    if (actualPage.url !== url) {
                        return false;
                    }

                    if (actualPage.changeAt < (Date.now() - 500)) {
                        return false;
                    }
                    return true;
                },
                /**
                 * Faz o carregamento de uma controller de uma application específica
                 *
                 * @param {String} application
                 * @param {String} module
                 * @param {String} controller
                 * @param {String|null} id
                 * @returns {$q.promise}
                 */
                resolvePage: function(application, module, controller, id) {
                    var defer = $q.defer();
                    var url = [
                        application,
                        module,
                        controller
                    ].join('/').replace(/\/{1,}/g, '/');

                    // Verifica se a instancia da página foi adicionada neste momento
                    if (pageService.isShowing(url)) {
                        applicationsService.setInstance(application);
                        return defer.resolve();
                    }

                    // garante que a aplicação foi carregada
                    var app = applicationsService.get(application);
                    app.then(function() {

                        // modulo default
                        if (!module || module === '') {
                            module = 'default';
                        }

                        // controller default
                        if (!controller || controller === '') {
                            controller = 'default';
                        }

                        require([
                            ['text!' + application, 'modules', module, 'tpl', controller + '.html'].join('/'),
                            [application, 'modules', module, controller].join('/')
                        ], function(template) {

                            var title = module.replace(/^./, function(v) {
                                return v.toUpperCase();
                            });
                            var subTitle = controller.replace(/^./, function(v) {
                                return v.toUpperCase();
                            });

                            // variáveis de scopo
                            var vars = {
                                id: id || null
                            };

                            pageService
                                    .resolve(application, template, url, vars, title, subTitle)
                                    .then(function() {
                                        defer.resolve();
                                    });


                        });
                    }, function(reason) {
                        console.log('Failed: applicationsService.get', reason);
                    });

                    return defer.promise;
                }
            };
            return pageService;
        }]);


});

