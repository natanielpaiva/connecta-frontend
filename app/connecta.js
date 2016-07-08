/* global Pace */
define([
  'jquery',
  'angular',
  // Configuração dos módulos
  'json!applications.json',
  // Módulos Angular Connecta
  'connecta.portal',
  'connecta.collector',
  'connecta.speaknow',
  'connecta.presenter',
  'connecta.maps',
  'connecta.inspection',
  // Dependências principais
  'angular-route',
  'angular-resource',
  'angular-ui-bootstrap',
  'bower_components/angular-ui-utils/ui-utils',
  'bower_components/angular-ui-tree/dist/angular-ui-tree.min',
  'angular-ng-table',
  'bower_components/connecta-prefixfree/prefixfree.min',
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
  'bower_components/angular-currency-mask/angular-currency-mask',
  'bower_components/angular-redactor/angular-redactor',
  'bower_components/angular-amchart/angular-amchart',
//  'bower_components/angular-facebook/lib/angular-facebook',
  'bower_components/ngAutocomplete/src/ngAutocomplete',
  'bower_components/angular-base64/angular-base64',
  'bower_components/angular-ui-select/dist/select',
  'bower_components/angular-scroll/angular-scroll.min',
  'bower_components/angular-show-on-konami-code/angular-show-on-konami-code'
], function($ , angular, applications, portal, collector, speaknow, presenter, maps, inspection) {

  var connecta = angular.module('connecta', [
    'connecta.portal',
    'connecta.collector',
    'connecta.speaknow',
    'connecta.presenter',
    'connecta.maps',
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
    'ui.select',
    'pascalprecht.translate',
    'angularFileUpload',
    'currencyMask',
    'AngularAmChart',
    'base64',
    'duScroll',
    'show-on-konami-code'
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

    $translateProvider.determinePreferredLanguage(function() {
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
    angular.forEach(arguments, function(module) {
      // Coloca a referência
      angular.forEach(module._routes, function(value) {
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
    var allRoutes = buildRoutes(portal, collector, speaknow, presenter, maps, inspection);

    angular.forEach(allRoutes, function(route, url) {
      if (route.controllerUrl) {
        if (!route.resolve) {
          route.resolve = {};
        }

        if (!route.resolve.load) {
          route.resolve.load = function($q, $rootScope) {
            var deferred = $q.defer();
            require([route.controllerUrl], function() {
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
   * Configura os padrões de tratamento de Request e Response dos serviços REST
   * @param {object} $httpProvider
   * @param {object} applications
   */
  function configureRequestInterceptors($httpProvider, applications) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
      return {
        request: function(config) {
          if ( new RegExp("^http.*$").test(config.url) ) {
            var matched = false;
            angular.forEach(applications, function(app, id){
              if (!matched) {
                matched = new RegExp("^"+app.host+".*$").test(config.url);
              }
            });

            if (matched) {
              config.withCredentials = true;
            }
          }
          return config;
        },
        responseError: function(rejection) {
          var responseInterceptors = {
            0: function(rejection) { // NET ERROR
              console.log('ERROR CODE 0', rejection);
              $rootScope.$broadcast('layout.notify', {
                  type:'ERROR',
                  message:'LAYOUT.NO_CONNECTION'
              });
            },
            400: function(rejection) { // BAD REQUEST
              $rootScope.$broadcast('layout.notify', rejection.data);
            },
            401: function(rejection) { // UNAUTHORIZED
              $rootScope.$broadcast('login.request_unathorized', rejection);
              $rootScope.$broadcast('layout.notify', rejection.data);
            },
            403: function(rejection) { // FORBIDDEN
              $rootScope.$broadcast('layout.notify', rejection.data);
            },
            404: function(rejection) { // PAGE NOT FOUND
              $rootScope.$broadcast('layout.notify', rejection.data);
            },
            500: function(rejection) { // INTERNAL SERVER ERROR
              $rootScope.$broadcast('layout.notify', rejection.data);
            },
            409: function(rejection) { // CONFLICT
              $rootScope.$broadcast('layout.notify', rejection.data);
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
   * @param {type} $compileProvider
   * @param {type} $sceProvider
   */
  function configureHTTPWhitelist($compileProvider, $sceProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|javascript):/);
    $sceProvider.enabled(false);
  }

  /**
   * Configura o listener da mudança de rotas
   * específico da aplicação
   * @param {type} $rootScope
   * @param {type} $menu
   * @param {type} LayoutService
   */
  function configureRouteChangeListener($rootScope, $menu, LayoutService) {

    /**
     * Verifica mudança de rotas e emite os eventos de entrada e saida dos módulos
     * Bem como a mudança do menu de contexto de cada módulo
     */
    $rootScope.$on('$routeChangeSuccess', function ($event, $destRoute, $originRoute) {
      var destModule = $destRoute.$$route && $destRoute.$$route.module ? $destRoute.$$route.module : null;
      var originModule = $originRoute && $originRoute.$$route && $originRoute.$$route.module ? $originRoute.$$route.module : null;
      var isModuleChange = (!originModule) || (destModule && $originRoute.$$route.module !== $destRoute.$$route.module);

      if (isModuleChange && destModule) {
        LayoutService.moduleChanged(originModule, $originRoute, destModule, $destRoute);
      }
    });
  }

  /**
   * Configura um request transformer para todos os requests pra incluir o
   * token de autenticação no cabeçalho
   *
   * @param {type} $http
   * @param {type} $rootScope
   * @param {type} $route
   * @param {type} LoginService
   * @param {type} DomainService
   * @returns {undefined}
   */
  function configureAuthenticationListener($http, $rootScope, $route, LoginService, DomainService){
    $http.defaults.transformRequest.push(function(data, getHeaders){
      getHeaders().Authorization = "Bearer "+LoginService.getAuthenticationToken();
      getHeaders().Domain = DomainService.getDomainName();
      return data;
    });

    $rootScope.$on('login.authenticated', function($event, authenticated){
      //Ao autenticar emite evento de enter do módulo novamnete
      if(authenticated){
        $rootScope.$broadcast($route.current.$$route.module + '.enter', $route.current);
      }
    });
  }

  connecta.config(function($controllerProvider, $compileProvider, $provide, $filterProvider, $translateProvider, $routeProvider, $httpProvider, $sceProvider, applications) {

    configureLazyProviders($controllerProvider, $compileProvider, $provide, $filterProvider);
    configureTranslations($translateProvider, window.navigator);
    configureRoutes($routeProvider);
    configureRequestInterceptors($httpProvider, applications);
    configureHTTPWhitelist($compileProvider, $sceProvider);

    //$locationProvider.html5Mode(true);
  });

  connecta.run(function($rootScope, $menu, $http, $route, LoginService, LayoutService, DomainService) {

    configureAuthenticationListener($http, $rootScope, $route, LoginService, DomainService);
    configureRouteChangeListener($rootScope, $menu, LayoutService);

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
    'portal/layout/service/menu',
    'portal/layout/service/heading-service',
    'portal/layout/service/layout',
    'portal/layout/directive/debug',
    'portal/layout/directive/scroll-to',
    'portal/layout/directive/select-all',
    'portal/layout/directive/random-class',
    'portal/layout/directive/key-value',
    'portal/layout/directive/type-switcher',
    'portal/layout/directive/bulk-action-bar',
    'portal/layout/directive/file-model',
    'portal/layout/directive/input-timeout',
    'portal/layout/directive/heading-popover',
    'portal/layout/directive/default-list-heading',
    'portal/layout/directive/compareTo',
    'portal/layout/directive/validated-field-holder',
    'portal/layout/directive/validated-field-messages',
    'portal/layout/filter/data-uri',
    'portal/layout/directive/file-model',
    'portal/layout/directive/conf-modal',
    'portal/auth/directive/login',
    'inspection/inspection/directive/box-table-inspection',
    'maps/drill/directive/box-table-maps',
    'inspection/inspection/directive/status-change',
    'inspection/inspection/directive/inspect-datepicker',
    'inspection/inspection/directive/drop-file',
    'speaknow/company/service/company-service',
    'portal/user/service/user-service',
    'portal/domain/service/domain-service',
    'portal/auth/directive/visibleToRoles'
  ], function(doc) {
    angular.bootstrap(doc, [connecta.name]);
  });

  return connecta;
});
