define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/ConnectaGeoJS',
    'bower_components/connectaGeoJS/index/maps_config',
    'bower_components/connectaGeoJS/index/require_config',
    'maps/layer-viewer/service/map-service',
    'maps/layer-viewer/service/viewer-service'
], function (maps, connectaGeoJS, mapsConfig) {
    return maps.lazy.service('ConnectaGeoService', function (mapsResources, MapService, MapViewerService) {

        //Bse URL Framework
        mapsConfig.baseURL = "bower_components/connectaGeoJS/index/";
        mapsConfig.proxyURLOpenlayers = mapsResources.openlayersProxy; 

        this.__connectaGeo = new connectaGeoJS();
        MapService.setConnectaGeo(this.__connectaGeo);

        this.showViewer = function (layerViewer, mapDivId) {

            if (this.__connectaGeo.__objMaps.length > 0) {                                
                this.__connectaGeo.__destroyObjMap(this.__connectaGeo.__objMaps[0]);
                delete MapService.map ;
            }
            
            MapService.createMap(layerViewer.viewerTypeImplEntity.id, mapDivId).then(function(map){
                MapViewerService.getViewerConfig(layerViewer, map, mapDivId);
            });

//            MapService.createMap(layerViewer.viewerTypeImplEntity.id, mapDivId);
//            
//            var interval = setInterval(function(){
//                if (typeof MapService.map !== 'undefined') {                    
//
//                    MapViewerService.getViewerConfig(layerViewer, MapService.map, mapDivId);
//                    clearInterval(interval);
//                }
//
//            });

        };
        
    });
});