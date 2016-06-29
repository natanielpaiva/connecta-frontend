define([
    'angular',
    'json!applications.json',
    'bower_components/angular-gridster/src/angular-gridster'
], function (angular, applications) {
    var portal = angular.module('connecta.portal', [
        'pascalprecht.translate',
        'ngCookies',
        'gridster',
        'angular-redactor'
//        ,'facebook'
    ]);
    
    portal._configKey = 'portal';

    portal.constant('portalResources', {
        base: applications.portal.host,
        dashboard: applications.portal.host + '/dashboard',
        dashboardViewers: applications.portal.host + '/dashboard/viewer',
        login: applications.portal.host + '/oauth/token',
        user: applications.portal.host + '/user',
        domain: applications.portal.host + '/domain'
    });

    portal.config(function ($translatePartialLoaderProvider, redactorOptions) { //, FacebookProvider
        $translatePartialLoaderProvider.addPart('portal/layout');
        $translatePartialLoaderProvider.addPart('portal/application');
        $translatePartialLoaderProvider.addPart('portal/dashboard');
        $translatePartialLoaderProvider.addPart('portal/auth');
        $translatePartialLoaderProvider.addPart('portal/user');
        $translatePartialLoaderProvider.addPart('portal/domain');

        var _redactorOptions = {
            // buttons: ['formatting', '|', 'bold', 'italic'],
            toolbarFixed: true
        };

        angular.extend(redactorOptions, _redactorOptions);

//
//        var appIdConnectaCloud = '950123895028823';
//        var appIdConnectaHml = '953657114675501';
//        var appIdConnectaLocal = '953794307995115';

//        FacebookProvider.init(appIdConnectaHml);
    });

    /**
     * Carrega os templates relativos ao portal no momento do carregamento
     * ao inves de on-demand
     * @param  $http
     * @param  $templateCache
     * @return
     */
    function loadTemplatesIntoCache($http, $templateCache) {
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
            }
        ];

        angular.forEach(templateUrls, function (template) {
            $http.get(template.url).then(function (response) {
                $templateCache.put(template.name, response.data);
            });
        });
    }

    portal.run(function ($http, $templateCache) {

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

    portal._menu = [
        {
            href: '/',
            title: 'LAYOUT.HOME',
            icon: 'icon-home',
            children: []
        },
        {
            href: 'dashboard',
            title: 'DASHBOARD.DASHBOARD_LIST',
            icon: 'icon-view-quilt',
            children: []
        },
        {
            href: 'user/profile',
            title: 'USER.PROFILE',
            icon: 'icon-user',
            children: []
        }
    ];

    return portal;
});
