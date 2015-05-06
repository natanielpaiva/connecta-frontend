define([
    'angular'
], function (angular) {
    var maps = angular.module('connecta.maps', []);


    maps.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('maps/layer-source');
        $translatePartialLoaderProvider.addPart('maps/layer');
        $translatePartialLoaderProvider.addPart('maps/layer-viewer');
        $translatePartialLoaderProvider.addPart('maps/import-shp');
    });



    maps.run(function (applications) {
        var appMaps = applications.filter(function (app) {
            return app.name === 'maps';
        }).pop();

        maps.lazy.value('mapsResources', {
            layerSource: appMaps.host + '/layerSources',
            layerSourceType: appMaps.host + '/layerSources',
            layer: appMaps.host + '/layers',
            layerViewer: appMaps.host + '/layer-viewer',
            layerViewerType: appMaps.host + '/layerViewerTypes',
            importSHP: appMaps.host + '/geoRest',
            regexBase64: '.*base64,'
        });

    });




    maps._routes = {
        '/maps/': {
            controller: 'LayerSourceListController',
            controllerUrl: 'maps/layer-source/controller/layer-source-list',
            templateUrl: 'app/maps/layer-source/template/layer-source-list.html'
        },
        '/maps/layer-source': {
            controller: 'LayerSourceListController',
            controllerUrl: 'maps/layer-source/controller/layer-source-list',
            templateUrl: 'app/maps/layer-source/template/layer-source-list.html'
        }
//        ,
//        '/maps/layer': {
//            controller: 'HomeController',
//            controllerUrl: 'module/submodule/controller/controller-name',
//            templateUrl: 'app/module/submodule/template/template-name.html'
//        },
//        '/maps/layer-viewer': {
//            controller: 'HomeController',
//            controllerUrl: 'module/submodule/controller/controller-name',
//            templateUrl: 'app/module/submodule/template/template-name.html'
//        },
//        '/maps/import-shp': {
//            controller: 'HomeController',
//            controllerUrl: 'module/submodule/controller/controller-name',
//            templateUrl: 'app/module/submodule/template/template-name.html'
//        }
        
    };


    maps._menu = [
        {
            href: 'maps/layer-source',
            title: 'LAYERSOURCE.LAYERSOURCE',
            icon: 'icon-database',
            children: []
        },
        {
            href: 'maps/layer',
            title: 'LAYER.LAYER',
            icon: 'icon-layers',
            children: []
        },
        {
            href: 'maps/layer-viewer',
            title: 'LAYERVIEWER.LAYERVIEWER',
            icon: 'icon-map',
            children: []
        },
        {
            href: 'maps/import-shp',
            title: 'IMPORT SHP',
            icon: 'icon-import-export',
            children: []
        }
    ];

    return maps;
});