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
    
     FacebookProvider.init('540992702633361');
  });

  portal.run(function($http, $templateCache) {

    $http.get('app/portal/layout/template/portal-error-messages.html').then(function(response) {
      $templateCache.put('portal-error-messages', response.data);
    });
    
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
    '/user/config': {
      controller: 'UserConfigController',
      controllerUrl: 'portal/user/controller/user-config',
      templateUrl: 'app/portal/user/template/user-config.html'
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
