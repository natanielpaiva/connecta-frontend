define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('MapServiceLayerViewerGroup', function (mapsResources, $http) {

        this.__connectaGeo = null;

        this.setConnectaGeo = function (connectaGeo) {
            this.__connectaGeo = connectaGeo;
        };

        this.createMap = function (mapTypeId) {
            var that = this;
            var configMap = null;
            //Openlayers
            if (mapTypeId == 1) {
                configMap = this.__connectaGeo.__mapsConfig.Openlayers.Map.configMap;
                configMap.divMap = "map-view-layer-viewer-group";
                this.__connectaGeo.__createObjMap(configMap, "__createControl", this.__connectaGeo.__mapsConfig.Openlayers.Controls.controlZB);

                var interval = setInterval(function () {
                    if (typeof that.__connectaGeo.__getObjMapByName(configMap.name) != 'undefined') {
                        that.setMap(that.__connectaGeo.__getObjMapByName(configMap.name));
                        clearInterval(interval);
                    }
                }, 20);
            }
        };

        this.setMap = function (Map) {
            this.map = Map;
        };

    });
});