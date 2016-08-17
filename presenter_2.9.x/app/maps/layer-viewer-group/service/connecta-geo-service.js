define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/ConnectaGeoJS',
    'bower_components/connectaGeoJS/index/maps_config',
    'bower_components/connectaGeoJS/index/require_config',
    'maps/layer-viewer-group/service/map-service',
    'maps/layer-viewer-group/service/viewer-service'
], function (maps, connectaGeoJS, mapsConfig) {
    return maps.lazy.service('ConnectaGeoServiceLayerViewerGroup', function (mapsResources, $http, MapServiceLayerViewerGroup, ViewerServiceLayerViewerGroup) {

        //Bse URL Framework
        mapsConfig.baseURL = "bower_components/connectaGeoJS/index/";
        mapsConfig.proxyURLOpenlayers = mapsResources.openlayersProxy;
        //mapsConfig.proxyURLOpenlayers = "http://localhost:7001/connecta-maps/proxy.jsp?";

        this.__connectaGeo = new connectaGeoJS();
        MapServiceLayerViewerGroup.setConnectaGeo(this.__connectaGeo);


        this.showViewer = function (layerViewerGroup) {

            if (this.__connectaGeo.__objMaps.length > 0) {
                this.__connectaGeo.__destroyObjMap(this.__connectaGeo.__objMaps[0]);
                delete MapServiceLayerViewerGroup.map;
            }

            //tipo de implementação do visualizador
//            MapService.createMap(layerViewer.viewerTypeImplEntity.id);
            MapServiceLayerViewerGroup.createMap(1);

            var interval = setInterval(function () {
                if (typeof MapServiceLayerViewerGroup.map !== 'undefined') {
                    ViewerServiceLayerViewerGroup.getViewerConfig(layerViewerGroup, MapServiceLayerViewerGroup.map);
                    clearInterval(interval);
                }

            });

        };

    });
});