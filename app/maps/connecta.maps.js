define([
    'angular'
], function (angular) {
    var maps = angular.module('connecta.maps', []);


    maps.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('maps/layer-source');
        $translatePartialLoaderProvider.addPart('maps/layer');
        $translatePartialLoaderProvider.addPart('maps/layer-viewer');
        $translatePartialLoaderProvider.addPart('maps/import');
    });



    maps.run(function (applications) {
        var appMaps = applications.maps;

        maps.lazy.value('mapsResources', {
            layerSource: appMaps.host + '/layerSources',
            layerSourceType: appMaps.host + '/layerSources',
            layer: appMaps.host + '/layers',
            layerViewer: appMaps.host + '/layerViewers',
            layerViewerType: appMaps.host + '/layerViewerTypes',
            geo: appMaps.host + '/geoRest',
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
        },
        '/maps/layer-source/new': {
            controller: 'LayerSourceFormController',
            controllerUrl: 'maps/layer-source/controller/layer-source-form',
            templateUrl: 'app/maps/layer-source/template/layer-source-form.html'
        },
        '/maps/layer-source/:id': {
            controller: 'LayerSourceViewController',
            controllerUrl: 'maps/layer-source/controller/layer-source-view',
            templateUrl: 'app/maps/layer-source/template/layer-source-view.html'
        },
        '/maps/layer-source/:id/edit': {
            controller: 'LayerSourceFormController',
            controllerUrl: 'maps/layer-source/controller/layer-source-form',
            templateUrl: 'app/maps/layer-source/template/layer-source-form.html'
        },
        '/maps/layer': {
            controller: 'LayerListController',
            controllerUrl: 'maps/layer/controller/layer-list',
            templateUrl: 'app/maps/layer/template/layer-list.html'
        },
        '/maps/layer/new': {
            controller: 'LayerFormController',
            controllerUrl: 'maps/layer/controller/layer-form',
            templateUrl: 'app/maps/layer/template/layer-form.html'
        },
        '/maps/layer/:id': {
            controller: 'LayerViewController',
            controllerUrl: 'maps/layer/controller/layer-view',
            templateUrl: 'app/maps/layer/template/layer-view.html'
        },
        '/maps/layer-viewer': {
            controller: 'LayerViewerListController',
            controllerUrl: 'maps/layer-viewer/controller/layer-viewer-list',
            templateUrl: 'app/maps/layer-viewer/template/layer-viewer-list.html'
        },
        '/maps/layer-viewer/new': {
            controller: 'LayerViewerFormController',
            controllerUrl: 'maps/layer-viewer/controller/layer-viewer-form',
            templateUrl: 'app/maps/layer-viewer/template/layer-viewer-form.html'
        },
        '/maps/layer-viewer/:id': {
            controller: 'LayerViewerViewController',
            controllerUrl: 'maps/layer-viewer/controller/layer-viewer-view',
            templateUrl: 'app/maps/layer-viewer/template/layer-viewer-view.html'
        },
        '/maps/layer-viewer/:id/edit': {
            controller: 'LayerViewerFormController',
            controllerUrl: 'maps/layer-viewer/controller/layer-viewer-form',
            templateUrl: 'app/maps/layer-viewer/template/layer-viewer-form.html'
        },
        '/maps/import/shp': {
            controller: 'ImportSHPController',
            controllerUrl: 'maps/import/controller/import-shp',
            templateUrl: 'app/maps/import/template/import-shp.html'
        }

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
            title: 'IMPORT.IMPORT',
            icon: 'icon-import-export',
            children: [
                {
                    href: 'maps/import/shp',
                    title: 'IMPORT.SHP'
                }
            ]
        }
    ];
    return maps;
});
