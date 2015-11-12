define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/ConnectaGeoJS',
    'bower_components/connectaGeoJS/index/maps_config',
    'bower_components/connectaGeoJS/index/openlayersImplementation/Popup',
    'bower_components/connectaGeoJS/index/require_config',    
    'maps/drill/service/map-service',
    'maps/drill/service/viewer-service'
], function (maps, connectaGeoJS, mapsConfig,ConnectaGeoPopup) {
    return maps.lazy.service('ConnectaGeoServiceDrill', function (mapsResources, $http, MapServiceDrill, ViewerServiceDrill) {
                
        //Bse URL Framework
        mapsConfig.baseURL = "bower_components/connectaGeoJS/index/";
        mapsConfig.proxyURLOpenlayers = mapsResources.openlayersProxy;

        this.__connectaGeo = new connectaGeoJS();
        this.mapCreated = false;
        MapServiceDrill.setConnectaGeo(this.__connectaGeo);


        this.createMap = function () {
            if (this.__connectaGeo.__objMaps.length > 0) {
                this.__connectaGeo.__destroyObjMap(this.__connectaGeo.__objMaps[0]);
                delete MapServiceDrill.map;
            }


            MapServiceDrill.createMap(1);
            var that = this;

            var interval = setInterval(function () {
                if (typeof MapServiceDrill.map !== 'undefined') {
                    that.mapCreated = true;
                    clearInterval(interval);
                }

            });

        };


        this.showViewer = function (layerViewer) {
            ViewerServiceDrill.getViewerConfig(layerViewer, MapServiceDrill.map);
        };
        
        
        this.addPopup = function(MAP,infoContent,xy){
          return new ConnectaGeoPopup(MAP,infoContent,xy);
        };

    });
});