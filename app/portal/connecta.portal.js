define([
  'angular',
  'json!applications.json',
  'bower_components/angular-gridster/src/angular-gridster',
], function(angular, applications) {
  var portal = angular.module('connecta.portal', [
    'pascalprecht.translate',
    'ngCookies',
    'gridster',
    'angular-redactor',
    'facebook'
  ]);

  portal.constant('portalResources', {
    base: applications.portal.host,
    dashboard: applications.portal.host + '/dashboard',
    login: applications.portal.host + '/auth',
    user: applications.portal.host + '/user'
  });

  portal.config(function($translatePartialLoaderProvider, redactorOptions, FacebookProvider) {
    $translatePartialLoaderProvider.addPart('portal/layout');
    $translatePartialLoaderProvider.addPart('portal/application');
    $translatePartialLoaderProvider.addPart('portal/dashboard');
    $translatePartialLoaderProvider.addPart('portal/auth');
    $translatePartialLoaderProvider.addPart('portal/user');

    var _redactorOptions = {
      // buttons: ['formatting', '|', 'bold', 'italic'],
      toolbarFixed: true
    };

    angular.extend(redactorOptions, _redactorOptions);

      FacebookProvider.init('693105304159812');
  });

  /**
   * Carrega os templates relativos ao portal no momento do carregamento
   * ao inves de on-demand
   * @param  $http
   * @param  $templateCache
   * @return
   */
  function loadTemplatesIntoCache($http, $templateCache){
    var templateUrls = [
      {
        name: 'portal-error-messages',
        url: 'app/portal/layout/template/portal-error-messages.html'
      },
      {
        name: 'heading-popover-notifications.html',
        url: 'app/portal/layout/template/heading-popover-notifications.html'
      },
      {
        name: 'heading-popover-user.html',
        url: 'app/portal/layout/template/heading-popover-user.html'
      },
      {
        name: 'heading-popover-apps.html',
        url: 'app/portal/layout/template/heading-popover-apps.html'
      },
    ];

    angular.forEach(templateUrls, function(template){
      $http.get(template.url).then(function(response) {
        $templateCache.put(template.name, response.data);
      });
    });
  }

  portal.run(function($http, $templateCache) {

    loadTemplatesIntoCache($http, $templateCache);

  });

  portal._routes = {
    '/': {
      controller: 'HomeController',
      controllerUrl: 'portal/layout/controller/home',
      templateUrl: 'app/portal/layout/template/home.html'
    },
    '/application': {
      controller: 'HomeController',
      controllerUrl: 'portal/layout/controller/home',
      templateUrl: 'app/portal/layout/template/home.html'
    },
    '/dashboard': {
      controller: 'DashboardListController',
      controllerUrl: 'portal/dashboard/controller/dashboard-list',
      templateUrl: 'app/portal/dashboard/template/dashboard-list.html'
    },
    '/dashboard/new': {
      controller: 'DashboardFormController',
      controllerUrl: 'portal/dashboard/controller/dashboard-form',
      templateUrl: 'app/portal/dashboard/template/dashboard-form.html'
    },
    '/dashboard/:id': {
      controller: 'DashboardViewController',
      controllerUrl: 'portal/dashboard/controller/dashboard-view',
      templateUrl: 'app/portal/dashboard/template/dashboard-view.html'
    },
    '/dashboard/:id/edit': {
      controller: 'DashboardFormController',
      controllerUrl: 'portal/dashboard/controller/dashboard-form',
      templateUrl: 'app/portal/dashboard/template/dashboard-form.html'
    },
    '/user/profile': {
      controller: 'UserProfileController',
      controllerUrl: 'portal/user/controller/user-profile',
      templateUrl: 'app/portal/user/template/user-profile.html'
    },
    '/user/new': {
      controller: 'UserFormController',
      controllerUrl: 'portal/user/controller/user-form',
      templateUrl: 'app/portal/user/template/user-form.html'
    }
  };

  portal._menu = [{
    href: '/',
    title: 'LAYOUT.HOME',
    icon: 'icon-home',
    children: []
  }];

  return portal;
});
