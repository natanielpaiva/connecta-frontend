define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de gerenciamento das aplicações
     */
    return portal.factory('applicationsService', function ($q, $rootScope, $resource) {
        var applications = [];
        var instance = null;

        var service = {
            data: {
            },
            list: function () {
                return applications;
            },
            // Atualiza a lista de applications do portal
            setApplications: function (apps) {
                applications = apps;
                $rootScope.$broadcast('applications.update');
            },
            // Atualiza a lista de applications do portal
            getApplications: function () {
                return applications;
            },
            // Obtém a instancia da aplicação que está sendo executada no momento
            getInstance: function () {
                return instance;
            },
            // Seta a instancia de aplicação que está sendo executada no momento
            setInstance: function (name) {
                var promiseApp = service.get(name);
                promiseApp.then(function (applicationConfig) {
                    instance = applicationConfig;
                    $rootScope.$broadcast('applications.change');
                });
            },
            resource: function (appName, path) {
                var host = service.getHost(appName);
                var url = [
                    host.replace(/\/+$/g, ''),
                    path.replace(/^\/+/g, '')
                ].join("/") + '/:id';

                return $resource(url, {
                    id: '@id'
                }, {
                    update: {
                        method: 'PUT'
                    },
                    count: {
                        method: 'GET',
                        url: url + '/count',
                        isArray: false,
                        transformResponse: function (data, header) {
                            return {
                                qt: parseInt(data)
                            };
                        }
                    }
                });
            },
            // Obtém o host de uma application
            getHost: function (appName) {
                var config = null;
                for (var a = 0; a < applications.length; a++) {
                    if (applications[a].name === appName) {
                        config = applications[a];
                        break;
                    }
                }
                if (config) {
                    return config.host;
                }
                return null;

            },
            //Faz o carregamento de uma controller de uma application específica
            get: function (name) {
                var defer = $q.defer();

                var config = null;
                for (var a = 0; a < applications.length; a++) {
                    if (applications[a].name === name) {
                        config = applications[a];
                        break;
                    }
                }

                // apenas configurações existentes podem ser carregadas
                if (config) {
                    if (config.loaded) {
                        defer.resolve(config);
                    } else {
                        // app ainda nao foi carregado
                        var applicationPath = [name, 'main'].join('/');

                        require([
                            'json!' + name + '-config',
                            applicationPath
                        ], function (applicationConfig, appMain) {

                            // insere a instancia da aplicação
                            config.app = appMain;

                            // flag de carregamento da configuração da aplicação
                            config.loaded = true;

                            // Estilos da aplicação
                            if (applicationConfig.styles) {
                                config.styles = applicationConfig.styles;
                            } else {
                                config.styles = [];
                            }


                            //Atualiza a referencia dos itens de menu
                            if (applicationConfig.navigation) {
                                config.navigation = applicationConfig.navigation;
                                var parseHref = function (item) {

                                    if (item.href) {
                                        return;
                                    }
                                    var href = '';
                                    if (item.search) {
                                        href = '/search/';
                                        href += name + '/';

                                        if (item.parent) {
                                            href += item.parent.name + '/';
                                        }
                                        href += item.name;
                                    } else {
                                        if (item.controller) {
                                            href = '/' + [name, item.controller].join('/');
                                        }
                                    }
                                    item.href = href;
                                };

                                for (var a = 0; a < config.navigation.length; a++) {
                                    var menuParent = config.navigation[a];

                                    menuParent.name = menuParent.title
                                            .toLowerCase()
                                            .replace(/^\s+|\s+$/g, '')
                                            .replace(/\s+/g, '-');

                                    if (!menuParent.children || menuParent.children.length < 1) {
                                        parseHref(menuParent);
                                    } else {

                                        for (var b = 0; b < menuParent.children.length; b++) {
                                            var menuChild = menuParent.children[b];
                                            menuChild.name = menuChild.title
                                                    .toLowerCase()
                                                    .replace(/^\s+|\s+$/g, '')
                                                    .replace(/[^a-z0-9]/gi, '-')
                                                    .replace(/\s+/g, '-');

                                            menuChild.parent = menuParent;
                                            parseHref(menuChild);
                                        }
                                    }
                                }
                            }

                            defer.resolve(config);
                            $rootScope.$broadcast('applications.update');
                        });
                    }
                } else {
                    //@todo: erro, aplicação nao existe
                }



                return defer.promise;
            }
        };
        return service;
    });
});

