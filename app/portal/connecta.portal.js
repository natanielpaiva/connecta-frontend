define([
    'angular'
], function (angular) {
    var portal = angular.module('connecta.portal', [
        'pascalprecht.translate',
        'ngCookies'
    ]);
    
    portal.config(function($translatePartialLoaderProvider){
        $translatePartialLoaderProvider.addPart('portal/layout');
        $translatePartialLoaderProvider.addPart('portal/application');
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
            ]
        }
    ];

    return portal;
});