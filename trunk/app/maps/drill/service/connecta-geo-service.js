define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/ConnectaGeoJS',
    'bower_components/connectaGeoJS/index/maps_config',
    'bower_components/connectaGeoJS/index/require_config',
    'maps/drill/service/map-service',
    'maps/drill/service/viewer-service'
], function (maps, connectaGeoJS, mapsConfig) {
    return maps.lazy.service('ConnectaGeoService', function (mapsResources, $http, MapService, ViewerService) {

        //Bse URL Framework
        mapsConfig.baseURL = "bower_components/connectaGeoJS/index/";
        mapsConfig.proxyURLOpenlayers = mapsResources.openlayersProxy; 

        this.__connectaGeo = new connectaGeoJS();
        MapService.setConnectaGeo(this.__connectaGeo);


        this.showViewer = function (layerViewer) {

            if (this.__connectaGeo.__objMaps.length > 0) {                                
                this.__connectaGeo.__destroyObjMap(this.__connectaGeo.__objMaps[0]);
                delete MapService.map ;
            }


            MapService.createMap(layerViewer.viewerTypeImplEntity.id);
            
            var interval = setInterval(function () {
                if (typeof MapService.map !== 'undefined') {                    

                    ViewerService.getViewerConfig(layerViewer, MapService.map);
                    clearInterval(interval);
                }

            });

        };
        
    });
});