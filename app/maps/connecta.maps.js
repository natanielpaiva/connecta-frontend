define([
    'angular',
    'angularjs-slider',
    'angular-tree-control'
], function (angular) {

    invokeCSS('/bower_components/angular-tree-control/css/tree-control.css');

    var maps = angular.module('connecta.maps', [
//        'ngAutocomplete'
        "treeControl",
        "rzModule"
    ]);

    maps._configKey = 'maps';

    maps.config(function ($translatePartialLoaderProvider, $httpProvider) {
        $translatePartialLoaderProvider.addPart('maps/i18n');

        $httpProvider.interceptors.push( function ($cookieStore) {
            return {
                request : function (config) {
                    var cookies = document.cookie;

                    if (cookies) {
                        var accessToken = $cookieStore.get('portal.auth.access_token');
                        var domainId = $cookieStore.get('user.domain.name');

                        config.headers['c-maps-access-token'] = accessToken;
                        config.headers['c-maps-domain-id'] = domainId;
                    }

                    return config;

                }
            };
        });
    });

    maps.run(function (applications) {
        var appMaps = applications.maps;
        maps.lazy.value('mapsResources', {
            viewer : appMaps.host + '/admin/viewer',
            dataSource : appMaps.host + '/admin/data-source',
            layer : appMaps.host + '/admin/layer',
            project : appMaps.host + '/admin/project',
            spatialDataSource : appMaps.host + '/admin/spatial-data-source'
        });
    });

    /*
     * Layer-Source
     */
    maps._routes = {
        // Viewer
        '/maps/viewer' : {
            controller : 'ViewerListController',
            controllerUrl : 'maps/viewer/controller/viewer-list',
            templateUrl : 'app/maps/viewer/template/viewer-list.html'
        },
        '/maps/viewer/new' : {
            controller : 'ViewerFormController',
            controllerUrl : 'maps/viewer/controller/viewer-form',
            templateUrl : 'app/maps/viewer/template/viewer-form.html'
        },
        '/maps/viewer/:id' : {
            controller : 'ViewerViewController',
            controllerUrl : 'maps/viewer/controller/viewer-view',
            templateUrl : 'app/maps/viewer/template/viewer-view.html'
        },
        '/maps/viewer/:id/edit' : {
            controller : 'ViewerFormController',
            controllerUrl : 'maps/viewer/controller/viewer-form',
            templateUrl : 'app/maps/viewer/template/viewer-form.html'
        },

        //Fonte de dados Geo
        '/maps/spatial-datasource': {
            controller: 'SpatialDataSourceListController',
            controllerUrl: 'maps/spatial-datasource/controller/spatial-datasource-list',
            templateUrl: 'app/maps/spatial-datasource/template/spatial-datasource-list.html'
        },
        '/maps/spatial-datasource/new': {
            controller: 'SpatialDataSourceFormController',
            controllerUrl: 'maps/spatial-datasource/controller/spatial-datasource-form',
            templateUrl: 'app/maps/spatial-datasource/template/spatial-datasource-form.html'
        },
        '/maps/spatial-datasource/:id':{
            controller: 'SpatialDataSourceViewController',
            controllerUrl: 'maps/spatial-datasource/controller/spatial-datasource-view',
            templateUrl:   'app/maps/spatial-datasource/template/spatial-datasource-view.html'
        },
        '/maps/spatial-datasource/:id/edit': {
            controller: 'SpatialDataSourceFormController',
            controllerUrl: 'maps/spatial-datasource/controller/spatial-datasource-form',
            templateUrl: 'app/maps/spatial-datasource/template/spatial-datasource-form.html'
        },

        //Camadas geográficas
        '/maps/geo-layer' : {
            controller : 'GeoLayerListController',
            controllerUrl : 'maps/geographic-layer/controller/geo-layer-list',
            templateUrl : 'app/maps/geographic-layer/template/geo-layer-list.html'
        },
        '/maps/geo-layer/new' : {
            controller : 'GeoLayerFormController',
            controllerUrl : 'maps/geographic-layer/controller/geo-layer-form',
            templateUrl : 'app/maps/geographic-layer/template/geo-layer-form.html'
        },
        '/maps/geo-layer/:id' : {
            controller : 'GeoLayerViewController',
            controllerUrl : 'maps/geographic-layer/controller/geo-layer-view',
            templateUrl : 'app/maps/geographic-layer/template/geo-layer-view.html'
        },
        '/maps/geo-layer/:id/edit' : {
            controller : 'GeoLayerFormController',
            controllerUrl : 'maps/geographic-layer/controller/geo-layer-form',
            templateUrl : 'app/maps/geographic-layer/template/geo-layer-form.html'
        },

        // Projetos
        '/maps/project' : {
            controller : 'ProjectListController',
            controllerUrl : 'maps/project/controller/project-list',
            templateUrl : 'app/maps/project/template/project-list.html'
        },
        '/maps/project/new' : {
            controller : 'ProjectFormController',
            controllerUrl : 'maps/project/controller/project-form',
            templateUrl : 'app/maps/project/template/project-form.html'
        },
        '/maps/project/:id' : {
            controller : 'ProjectViewController',
            controllerUrl : 'maps/project/controller/project-view',
            templateUrl : 'app/maps/project/template/project-view.html'
        },
        '/maps/project/:id/edit' : {
            controller : 'ProjectFormController',
            controllerUrl : 'maps/project/controller/project-form',
            templateUrl : 'app/maps/project/template/project-form.html'
        },

        //Fonte de dados Tabular
        '/maps/datasource' : {
            controller : 'DatasourceListController',
            controllerUrl : 'maps/datasource/controller/datasource-list',
            templateUrl : 'app/maps/datasource/template/datasource-list.html'
        },
        '/maps/datasource/new' : {
            controller : 'DatasourceFormController',
            controllerUrl : 'maps/datasource/controller/datasource-form',
            templateUrl : 'app/maps/datasource/template/datasource-form.html'
        },
        '/maps/datasource/:id' : {
            controller : 'DatasourceViewController',
            controllerUrl : 'maps/datasource/controller/datasource-view',
            templateUrl : 'app/maps/datasource/template/datasource-view.html'
        },
        '/maps/datasource/:id/edit' : {
            controller : 'DatasourceFormController',
            controllerUrl : 'maps/datasource/controller/datasource-form',
            templateUrl : 'app/maps/datasource/template/datasource-form.html'
      }

    };

    maps._menu = [
        {
            href: "/maps/spatial-datasource",
            title: "MENU.GEO_DATASOURCE",
            icon: "icon-location-pin"
        },
        {
            href: "/maps/geo-layer",
            title: "MENU.GEO_LAYERS",
            icon: "icon-layers"
        },
        {
            href: "/maps/datasource",
            title: "MENU.DATA_SOURCE",
            icon: "icon-database"
        },
        {
            href: "/maps/project",
            title: "MENU.PROJECTS",
            icon: "icon-folder"
        },
        {
            href: "/maps/viewer",
            title: "MENU.VIEWER",
            icon: "icon-viewer"
        }
    ];

    return maps;

    function invokeCSS(path) {
        var head = document.head;
        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', path);
        head.appendChild(link);
        return link;
    }
});
