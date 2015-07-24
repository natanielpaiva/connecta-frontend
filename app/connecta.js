define([
    'angular',
    'jquery',
    // Configuração dos módulos
    'json!applications.json',
    // Módulos Angular Connecta
    'connecta.portal',
    'connecta.collector',
    'connecta.speaknow',
    'connecta.presenter',
    'connecta.maps',
    'connecta.datamodel',
    'connecta.inspection',
    // Dependências principais
    'angular-route',
    'angular-resource',
    'angular-ui-bootstrap',
    'bower_components/angular-ui-utils/ui-utils',
    'bower_components/angular-ui-tree/dist/angular-ui-tree.min',
    'angular-ng-table',
    'bower_components/prefix-free/prefixfree.min',
    'bower_components/angular-animate/angular-animate.min',
    'bower_components/angular-cookies/angular-cookies.min',
    'bower_components/angular-touch/angular-touch.min',
    'bower_components/angular-i18n/angular-locale_pt-br',
    'bower_components/angular-translate/angular-translate.min',
    'bower_components/angular-translate-loader-partial/angular-translate-loader-partial.min',
    'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min',
    'bower_components/ngDraggable/ngDraggable',
    'bower_components/ng-tags-input/ng-tags-input',
    'bower_components/angular-drag-and-drop-lists/angular-drag-and-drop-lists.min',
    'bower_components/angular-messages/angular-messages.min',
    'bower_components/ng-file-upload/angular-file-upload.min',
    'bower_components/amcharts/dist/amcharts/amcharts',
    'bower_components/angular-redactor/angular-redactor'
], function (angular, $, applications, portal, collector, speaknow, presenter, maps, datamodel, inspection) {

    var connecta = angular.module('connecta', [
        'connecta.portal',
        'connecta.collector',
        'connecta.speaknow',
        'connecta.presenter',
        'connecta.maps',
        'connecta.datamodel',
        'connecta.inspection',
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngLocale',
        'ngTable',
        'ngDraggable',
        'ngTagsInput',
        'dndLists',
        'ngMessages',
        'ui.bootstrap',
        'ui.tree',
        'ui.mask',
        'pascalprecht.translate',
        'angularFileUpload'
    ]);

    // Configuração do backend dos módulos
    connecta.constant('applications', applications);

    /**
     * Salva a referência dos providers em todos os módulos para poder
     * registrar componentes por lazy loading
     *
     * @param {type} $controllerProvider
     * @param {type} $compileProvider
     * @param {type} $provide
     * @param {type} $filterProvider
     * @returns {undefined}
     */
    function configureLazyProviders($controllerProvider, $compileProvider, $provide, $filterProvider) {
        var lazy = {
            controller: $controllerProvider.register,
            directive: $compileProvider.directive,
            constant: $provide.constant,
            decorator: $provide.decorator,
            factory: $provide.factory,
            provider: $provide.provider,
            service: $provide.service,
            value: $provide.value,
            filter: $filterProvider.register
        };

        connecta.lazy = lazy;
        portal.lazy = lazy;
        collector.lazy = lazy;
        speaknow.lazy = lazy;
        presenter.lazy = lazy;
        maps.lazy = lazy;
        datamodel.lazy = lazy;
        inspection.lazy = lazy;
    }

    /**
     * Configura as traduções da aplicação
     * @param {type} $translateProvider
     * @param {type} navigator
     * @returns {undefined}
     */
    function configureTranslations($translateProvider, navigator) {
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'app/{part}/translate/{lang}.json'
        });

        $translateProvider.determinePreferredLanguage(function () {
            if (navigator.userLanguage || navigator.language) {
                var lang = navigator.userLanguage || navigator.language;
                return lang.toLowerCase();
            }

            return 'en-us';
        });

        $translateProvider.fallbackLanguage('en-us');

        $translateProvider.useCookieStorage();
    }

    /**
     * Mescla todas as rotas passadas e retorna o objeto final das rotas
     * @returns {object}
     */
    function buildRoutes() {
        var finalRouteObject = {};
        angular.forEach(arguments, function (module) {
            // Coloca a referência
            angular.forEach(module._routes, function (value) {
                value.module = module.name;
            });

            $.extend(true, finalRouteObject, module._routes);
        });
        return finalRouteObject;
    }

    /**
     * Configura as rotas da aplicação
     * @param {type} $routeProvider
     * @returns {undefined}
     */
    function configureRoutes($routeProvider) {
        var allRoutes = buildRoutes(portal, collector, speaknow, presenter, maps, datamodel, inspection);

        angular.forEach(allRoutes, function (route, url) {
            if (route.controllerUrl) {
                if (!route.resolve) {
                    route.resolve = {};
                }

                if (!route.resolve.load) {
                    route.resolve.load = function ($q, $rootScope) {
                        var deferred = $q.defer();
                        require([route.controllerUrl], function () {
                            deferred.resolve();
                            $rootScope.$apply();
                        });
                        return deferred.promise;
                    };
                }
            }

            $routeProvider.when(url, route);
        });
    }

    /**
     * Configura o listener da mudança de rotas para recarregar o menu
     * específico da aplicação
     * @param {type} $rootScope
     * @param {type} $menu
     */
    function configureMenuRouteChangeListener($rootScope, $menu) {
        
        $rootScope.$on('$routeChangeSuccess', function ($event, $route) {
            if ($route.$$route && $route.$$route.module) {
                $menu.set(angular.module($route.$$route.module)._menu);
            }
        });
    }

    /**
     * Configura os padrões de tratamento de Request e Response dos serviços REST
     * @param {type} $httpProvider
     * @returns {undefined}
     */
    function configureRequestInterceptors($httpProvider) {
        $httpProvider.interceptors.push(function ($log, $q) {
            return {
                'request': function (config) {
                    return config;
                },
                'response': function (response) {
                    return response;
                },
                'responseError': function (rejection) {
                    $log.debug('Received response: ', rejection.status);

                    var responseInterceptors = {
                        400: function (rejection) {
                            // BAD REQUEST
                            $log.debug('Erro de neǵocio: ', rejection.data);
                        },
                        401: function (rejection) {
                            // UNAUTHORIZED
                            $log.debug('Não autorizado: ', rejection.data);
                        },
                        403: function (rejection) {
                            // FORBIDDEN
                            $log.debug('Acesso negado: ', rejection.data);
                        },
                        404: function (rejection) {
                            // PAGE NOT FOUND
                            $log.debug('Recurso não encontrado: ', rejection.data);
                        },
                        500: function (rejection) {
                            // INTERNAL SERVER ERROR
                            $log.debug('Ocorreu um erro: ', rejection.data);
                        }
                    };

                    if (responseInterceptors[rejection.status]) {
                        responseInterceptors[rejection.status](rejection);
                    }

                    return $q.reject(rejection);
                }
            };
        });
    }

    /**
     * Configura o whitelist de todos os protocolos que podem ser usados
     * em links no HTML (retira o unsafe:... da frente do protocolo)
     */
    function configureHTTPWhitelist($compileProvider, $sceProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|javascript):/);
        $sceProvider.enabled(false);
    }

    connecta.config(function ($controllerProvider, $compileProvider, $provide, $filterProvider, $translateProvider, $routeProvider, $httpProvider, $sceProvider, $locationProvider) {

        configureLazyProviders($controllerProvider, $compileProvider, $provide, $filterProvider);
        configureTranslations($translateProvider, window.navigator);
        configureRoutes($routeProvider);
        configureRequestInterceptors($httpProvider);
        configureHTTPWhitelist($compileProvider, $sceProvider);

        //$locationProvider.html5Mode(true);
    });

    connecta.run(function ($rootScope, $menu) {

        configureMenuRouteChangeListener($rootScope, $menu);

    });

    /**
     * Inicia as dependências principais do módulo do Portal e inicia a aplicação
     *
     * FIXME Devia apenas chamar as diretivas e cada uma delas declarar suas dependências
     *
     * @param {type} doc
     * @returns {undefined}
     */
    require([
        'domReady!',
        'portal/layout/controller/main',
        'portal/layout/controller/home',
        'portal/layout/service/applications',
        //'portal/layout/service/pages',
        'portal/layout/service/menu',
        'portal/layout/service/layout',
        //'portal/layout/directive/sidebar',
        // 'portal/layout/service/search',
        'portal/layout/directive/debug',
        'portal/layout/directive/key-value',
        'portal/layout/directive/file-model',
        'portal/layout/directive/input-timeout',
        'portal/layout/filter/data-uri',
        'portal/layout/directive/file-model',
        'portal/layout/directive/conf-modal',
        'presenter/viewer/directive/am-charts',
        'presenter/viewer/directive/am-chart-serial',
        'presenter/viewer/directive/am-chart-pie-donut',
        'presenter/viewer/directive/am-chart-xy',
        'presenter/viewer/directive/am-chart-radar',
        'presenter/viewer/directive/am-chart-gauge',
        'presenter/viewer/directive/am-chart-funnel',
        'inspection/inspection/directive/box-table-inspection'
    ], function (doc) {
        angular.bootstrap(doc, [connecta.name]);
    });

    return connecta;
});
