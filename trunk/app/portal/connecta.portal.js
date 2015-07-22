define([
    'angular',
    // 'bower_components/angular-redactor/angular-redactor',
    'bower_components/angular-gridster/src/angular-gridster'
], function (angular) {
    var portal = angular.module('connecta.portal', [
        'pascalprecht.translate',
        'ngCookies',
        'gridster',
        'angular-redactor'
    ]);

    portal.config(function($translatePartialLoaderProvider, redactorOptions){
        $translatePartialLoaderProvider.addPart('portal/layout');
        $translatePartialLoaderProvider.addPart('portal/application');

        var _redactorOptions = {
          // buttons: ['formatting', '|', 'bold', 'italic'],
          toolbarFixed:true
        };

        angular.extend(redactorOptions, _redactorOptions);
    });

    portal._routes = {
        '/': {
            controller: 'HomeController',
            controllerUrl: 'portal/layout/controller/home',
            templateUrl: 'app/portal/layout/template/home.html'
        },
        '/dashboard': {
            controller: 'DashboardController',
            controllerUrl: 'portal/dashboard/controller/dashboard',
            templateUrl: 'app/portal/dashboard/template/dashboard.html'
        },
        '/application': {
            controller: 'HomeController',
            controllerUrl: 'portal/layout/controller/home',
            templateUrl: 'app/portal/layout/template/home.html'
        }
    };

    portal._menu = [
        {
            href: '/',
            title: 'LAYOUT.HOME',
            icon: 'icon-home',
            children: []
        },
        {
            title: 'APPLICATION.MODULES',
            icon: 'icon-now-widgets',
            children: [
                {
                    href: 'application',
                    title: 'APPLICATION.MODULES'
                }
//                {
//                    href: 'maps',
//                    title: 'Maps'
//                }
            ]
        }
    ];

    portal.run(function($http, $templateCache, applications){

        var appPortal = applications.portal;

        $http.get('app/portal/layout/template/portal-error-messages.html').then(function(response) {
            $templateCache.put('portal-error-messages', response.data);
        });

    });

    return portal;
});
