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
  'bower_components/angular-currency-mask/angular-currency-mask',
  'bower_components/angular-redactor/angular-redactor'
], function(angular, $, applications, portal, collector, speaknow, presenter, maps, datamodel, inspection) {

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
    'angularFileUpload',
    'currencyMask'
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
    var allRoutes = buildRoutes(portal, collector, speaknow, presenter, maps, datamodel, inspection);

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
   * @param {type} $httpProvider
   * @returns {undefined}
   */
  function configureRequestInterceptors($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push(function($log, $q, $rootScope) {
      return {
        responseError: function(rejection) {
          $log.warn(rejection.status+': '+rejection.statusText, rejection);

          var responseInterceptors = {
            400: function(rejection) { // BAD REQUEST
              
            },
            401: function(rejection) { // UNAUTHORIZED
              $rootScope.$broadcast('login.request_unathorized');
            },
            403: function(rejection) { // FORBIDDEN
              
            },
            404: function(rejection) { // PAGE NOT FOUND
              
            },
            500: function(rejection) { // INTERNAL SERVER ERROR
              
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
   * Configura o listener da mudança de rotas para recarregar o menu
   * específico da aplicação
   * @param {type} $rootScope
   * @param {type} $menu
   */
  function configureMenuRouteChangeListener($rootScope, $menu) {

    $rootScope.$on('$routeChangeSuccess', function($event, $route) {
      if ($route.$$route && $route.$$route.module) {
        $menu.set(angular.module($route.$$route.module)._menu);
      }
    });
  }
  
  /**
   * Configura um request transformer para todos os requests pra incluir o
   * token de autenticação no cabeçalho
   * 
   * @param {type} $http
   * @param {type} LoginService
   * @returns {undefined}
   */
  function configureAuthenticationRequestListener($http, LoginService){
    $http.defaults.transformRequest.push(function(data, getHeaders){
      getHeaders().Authorization = LoginService.getAuthenticationToken();
    });
  }

  connecta.config(function($controllerProvider, $compileProvider, $provide, $filterProvider, $translateProvider, $routeProvider, $httpProvider, $sceProvider) {

    configureLazyProviders($controllerProvider, $compileProvider, $provide, $filterProvider);
    configureTranslations($translateProvider, window.navigator);
    configureRoutes($routeProvider);
    configureRequestInterceptors($httpProvider);
    configureHTTPWhitelist($compileProvider, $sceProvider);

    //$locationProvider.html5Mode(true);
  });

  connecta.run(function($rootScope, $menu, $http, LoginService) {
    
    configureAuthenticationRequestListener($http, LoginService);
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
    'portal/layout/service/menu',
    'portal/layout/service/layout',
    'portal/auth/directive/login',
    'portal/layout/directive/debug',
    'portal/layout/directive/scroll-to',
    'portal/layout/directive/random-class',
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
    'inspection/inspection/directive/box-table-inspection',
    'inspection/inspection/directive/status-change',
    'inspection/inspection/directive/inspect-datepicker',
    'inspection/inspection/directive/drop-file'
  ], function(doc) {
    angular.bootstrap(doc, [connecta.name]);
  });

  return connecta;
});
