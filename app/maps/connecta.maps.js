define([
    'angular'
], function (angular) {
    var maps = angular.module('connecta.maps', [
//        'ngAutocomplete'
    ]);

    maps._configKey = 'maps';

    maps.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('maps/i18n');
    });

    maps.run(function (applications) {
        var appMaps = applications.maps;
        maps.lazy.value('mapsResources', {
            dataSource : appMaps.host + '/data-source',
            layer : appMaps.host + '/layer',
            project : appMaps.host + '/project',
            spatialDataSource : appMaps.host + '/spatial-data-source'
        });
    });

    /*
     * Layer-Source
     */
    maps._routes = {
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
        '/maps/project/:id/edit' : {
            controller : 'ProjectFormController',
            controllerUrl : 'maps/project/controller/project-form',
            templateUrl : 'app/maps/project/template/project-form.html'
        },

        //Origem de dados Tabular
        '/maps/datasource' : {
            controller : 'DatasourceListController',
            controllerUrl : 'maps/datasource/controller/datasource-list',
            templateUrl : 'app/maps/datasource/template/datasource-list.html'
        }

    };

    maps._menu = [
        {
            href: "",
            title: "MENU.ANALYSIS",
            icon: "icon-analysis"
        },
        {
            href: "/maps/spatial-datasource",
            title: "MENU.GEO_DATASOURCE",
            icon: "icon-database"
        },
        {
            href: "/maps/geo-layer",
            title: "MENU.GEO_LAYERS",
            icon: "icon-layers"
        },
        {
            href: "/maps/datasource",
            title: "MENU.DATA_SOURCE",
            icon: "icon-location-pin"
        },
        {
            href: "/maps/project",
            title: "MENU.PROJECTS",
            icon: "icon-folder"
        }
    ];

    return maps;
});
