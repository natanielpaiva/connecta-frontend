define([
    'angular'
], function (angular) {
    var maps = angular.module('connecta.maps', []);


    maps.config(function ($translatePartialLoaderProvider) {
        $translatePartialLoaderProvider.addPart('maps/layer-source');
        $translatePartialLoaderProvider.addPart('maps/layer');
        $translatePartialLoaderProvider.addPart('maps/layer-viewer');
        $translatePartialLoaderProvider.addPart('maps/layer-viewer-group');
        $translatePartialLoaderProvider.addPart('maps/import');
        $translatePartialLoaderProvider.addPart('maps/presenter-source');
    });



    maps.run(function (applications) {
        var appMaps = applications.maps;

        maps.lazy.value('mapsResources', {
            layerSource: appMaps.host + '/layerSources',
            layerSourceType: appMaps.host + '/layerSourceTypes',
            presenterSource: appMaps.host + '/presenterSources',
            layer: appMaps.host + '/layers',
            layerViewer: appMaps.host + '/layerViewers',
            layerViewerGroup: appMaps.host + '/layerViewerGroups',
            groupLayerViewer: appMaps.host + '/groupLayerViewers',
            layerViewerType: appMaps.host + '/layerViewerTypes',
            geo: appMaps.host + '/geoRest',
            openlayersProxy: appMaps.host + '/proxy.jsp?',
            regexBase64: '.*base64,'
        });

    });



    /*
     * Layer-Source
     */
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
        /*
         * Layer
         */
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
        '/maps/layer/:id/edit': {
            controller: 'LayerFormController',
            controllerUrl: 'maps/layer/controller/layer-form',
            templateUrl: 'app/maps/layer/template/layer-form.html'
        },
        /*
         * Layer-Viewer
         */
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
        /*
         * Layer-Viewer-Group
         */
        '/maps/layer-viewer-group': {
            controller: 'LayerViewerGroupListController',
            controllerUrl: 'maps/layer-viewer-group/controller/layer-viewer-group-list',
            templateUrl: 'app/maps/layer-viewer-group/template/layer-viewer-group-list.html'
        },
        '/maps/layer-viewer-group/new': {
            controller: 'LayerViewerGroupFormController',
            controllerUrl: 'maps/layer-viewer-group/controller/layer-viewer-group-form',
            templateUrl: 'app/maps/layer-viewer-group/template/layer-viewer-group-form.html'
        },
        '/maps/layer-viewer-group/:id': {
            controller: 'LayerViewerGroupViewController',
            controllerUrl: 'maps/layer-viewer-group/controller/layer-viewer-group-view',
            templateUrl: 'app/maps/layer-viewer-group/template/layer-viewer-group-view.html'
        },
        '/maps/layer-viewer-group/:id/edit': {
            controller: 'LayerViewerGroupFormController',
            controllerUrl: 'maps/layer-viewer-group/controller/layer-viewer-group-form',
            templateUrl: 'app/maps/layer-viewer-group/template/layer-viewer-group-form.html'
        },
        /*
         * Import-SHP
         */
        '/maps/import/shp': {
            controller: 'ImportSHPController',
            controllerUrl: 'maps/import/controller/import-shp',
            templateUrl: 'app/maps/import/template/import-shp.html'
        },
        /*
         * Presenter-Source
         */
        '/maps/presenter-source': {
            controller: 'PresenterSourceListController',
            controllerUrl: 'maps/presenter-source/controller/presenter-source-list',
            templateUrl: 'app/maps/presenter-source/template/presenter-source-list.html'
        },
        '/maps/presenter-source/new': {
            controller: 'PresenterSourceFormController',
            controllerUrl: 'maps/presenter-source/controller/presenter-source-form',
            templateUrl: 'app/maps/presenter-source/template/presenter-source-form.html'
        },
        '/maps/presenter-source/:id': {
            controller: 'PresenterSourceViewController',
            controllerUrl: 'maps/presenter-source/controller/presenter-source-view',
            templateUrl: 'app/maps/presenter-source/template/presenter-source-view.html'
        },
        '/maps/presenter-source/:id/edit': {
            controller: 'PresenterSourceFormController',
            controllerUrl: 'maps/presenter-source/controller/presenter-source-form',
            templateUrl: 'app/maps/presenter-source/template/presenter-source-form.html'
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
            href: 'maps/layer-viewer-group',
            title: 'LAYERVIEWERGROUP.LAYERVIEWERGROUP',
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
        },
        {
            href: 'maps/presenter-source',
            title: 'PRESENTERSOURCE.PRESENTERSOURCE',
            icon: 'icon-map',
            children: []
        }
    ];
    return maps;
});
