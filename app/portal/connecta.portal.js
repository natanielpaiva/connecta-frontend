define([
    'angular',
    'bower_components/angular-gridster/src/angular-gridster'
], function (angular) {
    var portal = angular.module('connecta.portal', [
        'pascalprecht.translate',
        'ngCookies',
        'gridster',
        'angular-redactor'
    ]);

    portal.config(function ($translatePartialLoaderProvider, redactorOptions) {
        $translatePartialLoaderProvider.addPart('portal/layout');
        $translatePartialLoaderProvider.addPart('portal/application');
        $translatePartialLoaderProvider.addPart('portal/dashboard');

        var _redactorOptions = {
            // buttons: ['formatting', '|', 'bold', 'italic'],
            toolbarFixed: true
        };

        angular.extend(redactorOptions, _redactorOptions);
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
        '/login': {
            controller: 'LoginController',
            controllerUrl: 'portal/login/controller/login',
            templateUrl: 'app/portal/login/template/login.html'
        }
    };

    portal._menu = [
        {
            href: '/',
            title: 'LAYOUT.HOME',
            icon: 'icon-home',
            children: []
        }
    ];

    portal.run(function ($http, $templateCache, applications) {

        var appPortal = applications.portal;
        portal.lazy.value('portalConfig', appPortal);

        portal.lazy.value('portalResources', {
            dashboard: applications.portal.host + '/dashboard'
        });

        $http.get('app/portal/layout/template/portal-error-messages.html').then(function (response) {
            $templateCache.put('portal-error-messages', response.data);
        });

        portal.lazy.value('portalResources', {
            base: appPortal.host,
            login: appPortal.host + '/auth'
        });

    });

    return portal;
});
