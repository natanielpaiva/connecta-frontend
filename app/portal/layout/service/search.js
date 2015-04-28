/**
 * Serviço para busca de resources
 */
define([
    'connecta.portal',
    'text!portal/layout/template/search.html'
], function(portal, searchPageTemplate) {

    function generateTableTemplate(config) {
        //cria o template de acordo com os parametros
        var template = '';
        for (var attr in config.search.tableParams) {
            if (!config.search.tableParams.hasOwnProperty(attr)) {
                continue;
            }
            var param = config.search.tableParams[attr];
            var filter = '';
            if (param.filter) {
                filter = ' | ' + param.filter;
            }

            template += "<td>{{item." + attr + filter + "}}</td>";
        }
        return template;
    }

    portal.factory('searchService', [
        '$q',
        '$rootScope',
        '$resource',
        'applicationsService',
        'pageService',
        function($q, $rootScope, $resource, applicationsService, pageService) {
            var instance = null;

            /**
             * Obtém as configurações de um item do buscador
             *
             * @param {String} application
             * @param {String} item
             * @param {String} child
             * @returns {$q.defer.promise}
             */
            function getConfig(application, item, child) {
                var defer = $q.defer();

                // garante que a aplicação foi carregada
                var app = applicationsService.get(application);
                app.then(function(appConfig) {
                    var searchConfig;

                    // encontra a configuração para o buscador
                    for (var nav = 0; nav < appConfig.navigation.length; nav++) {
                        var menuParent = appConfig.navigation[nav];
                        if (menuParent.name === item) {

                            if (child) {
                                for (var c = 0; c < menuParent.children.length; c++) {
                                    var menuChild = menuParent.children[c];
                                    if (menuChild.name === child) {
                                        searchConfig = menuChild;
                                    }
                                }
                            } else {
                                searchConfig = menuParent;
                            }
                            break;
                        }
                    }

                    if (searchConfig) {
                        // já possui o serviço do buscador
                        if (searchConfig.search.$resource) {
                            return defer.resolve(searchConfig);
                        }

                        // gera o service de busca
                        searchConfig.search.application = application;

                        // instancia o serviço do buscador
                        if (searchConfig.search.url) {
                            // serviço padrão de busca, usando CRUD
                            var url = [
                                appConfig.host.replace(/\/+$/g, ''),
                                searchConfig.search.url.replace(/^\/+/g, '')
                            ].join("/");

                            searchConfig.search.$resource = $resource(url, {}, {
                                count: {
                                    method: 'GET',
                                    url: url + '/count',
                                    isArray: false,
                                    transformResponse: function(data, header) {
                                        return {
                                            qt: parseInt(data)
                                        };
                                    }
                                }
                            });
                        } else if (searchConfig.search.service) {
                            // serviço personalizado de busca
                            // @todo: carregar serviço, defer config
                        } else {
                            throw new Error("@todo: Configuração inválida ???");
                        }

                        // corrige o mapeamento das controllers e ações
                        if (searchConfig.search.controllers) {
                            for (var ctrl in searchConfig.search.controllers) {
                                if (!searchConfig.search.controllers.hasOwnProperty(ctrl)) {
                                    continue;
                                }
                                var oldUrl = searchConfig.search.controllers[ctrl];
                                var newUrl = '/' + [
                                    application,
                                    oldUrl.replace(/^\/+/g, '')
                                ].join('/');
                                searchConfig.search.controllers[ctrl] = newUrl;
                            }
                        }


                        /**
                         * Gera o método para execução da consulta
                         * @param {type} params
                         * @returns {unresolved}
                         */
                        searchConfig.search.doSearch = function(params) {
                            return $q.all([
                                searchConfig.search.$resource.query(params),
                                searchConfig.search.$resource.count(params)
                            ]).then(function(results) {
                                var defer = $q.defer();
                                results[0].$promise.then(function(res) {
                                    results[1].$promise.then(function(qt) {
                                        var out = {
                                            data: res,
                                            count: qt.qt
                                        };
                                        defer.resolve(out);
                                    });
                                });
                                return defer.promise;
                            });
                        };

                        //configura o template de renderizaçao do item
                        var templaterPath;
                        if (searchConfig.search.template) {
                            templaterPath = [
                                application,
                                'modules',
                                searchConfig.search.template
                            ].join('/');

                            require([
                                'text!' + templaterPath + '.html'
                            ], function(template) {
                                searchConfig.search.templateContent = template;
                                defer.resolve(searchConfig);
                            });

                        } else if (searchConfig.search.tableParams) {
                            searchConfig.search.templateContent = generateTableTemplate(searchConfig);
                            defer.resolve(searchConfig);
                        } else {
                            throw new Error('@todo: Erro de configuração??');
                        }
                    } else {
                        defer.resolve();
                    }
                });

                return defer.promise;
            }

            var searchService = {
                // Obtém a instancia de busca atual
                getInstance: function() {
                    return instance;
                },
                hide: function() {
                    $rootScope.$broadcast('search.hide');
                },
                /**
                 * Faz o tratamento necessário para exibir o resultado de busca
                 * quando exibido como página
                 *
                 * @param {String} application
                 * @param {String} item
                 * @param {String} child
                 * @returns {$q.promise}
                 */
                resolvePage: function(application, item, child) {
                    var defer = $q.defer();
                    var url = [
                        'search-a',
                        application,
                        item,
                        child
                    ].join('/').replace(/(\/)*$/, '');

                    // Verifica se a instancia da página foi adicionada neste momento
                    if (pageService.isShowing(url)) {
                        applicationsService.setInstance(application);
                        return defer.resolve();
                    }

                    // garante que a aplicação foi carregada
                    getConfig(application, item, child).then(function(searchConfig) {

                        if (!searchConfig || !searchConfig.search) {
                            throw new Error("@todo: Url de busca inválida???");
                        }

                        var title = 'Administrar';
                        var subTitle = 'bla';

                        // variáveis de scopo
                        var vars = {
                            search: searchConfig.search
                        };

                        pageService
                                .resolve(application, searchPageTemplate, url, vars, title, subTitle)
                                .then(function() {
                                    defer.resolve();
                                });

                    });


                    return defer.promise;
                },
                /**
                 * Faz o tratamento necessário para exibir o buscador integrado
                 *
                 * @param {type} application
                 * @param {type} item
                 * @param {type} child
                 * @returns {$q@call;defer.promise}
                 */
                resolveEmbedded: function(application, item, child) {
                    var defer = $q.defer();

                    var app = applicationsService.get(application);
                    app.then(function(appConfig) {

                        // informa a instancia da aplicação sendo executada
                        applicationsService.setInstance(application);


                        var config = getConfig(appConfig, item, child);
                        if (!config || !config.search) {
                            throw new Error("@todo: Url de busca inválida???");
                        }

                        // já possui o serviço do buscador
                        if (config.search.$resource) {
                            // exibe a página
                            $rootScope.$broadcast('search.show');
                            defer.resolve();
                            return;
                        }

                        // gera o service de busca
                        forgeSearch(config, application, appConfig).then(function() {
                            $rootScope.$broadcast('search.show');
                            defer.resolve();
                        });

                    }, function(reason) {
                        console.log('Failed: applicationsService.get', reason);
                    });

                    return defer.promise;
                }
            };
            return searchService;
        }]);
});

