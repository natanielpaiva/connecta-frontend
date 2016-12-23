/* global angular */

define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('MapService', function($q){
        this.__connectaGeo = null;

        this.setConnectaGeo = function (connectaGeo) {
            this.__connectaGeo = connectaGeo;
        };

//        this.createMap = function (mapTypeId, mapDivId) {
//            var that=this;
//            var configMap = null;
//            //Openlayers
//            if (mapTypeId == 1) {
//                configMap = this.__connectaGeo.__mapsConfig.Openlayers.Map.configMap;
//                configMap.divMap = mapDivId?mapDivId:"map-view";
//                this.__connectaGeo.__createObjMap(configMap,"__createControl",this.__connectaGeo.__mapsConfig.Openlayers.Controls.controlZB);
//                                                                                
//                var interval = setInterval(function () {
//                    if (typeof that.__connectaGeo.__getObjMapByName(configMap.name) != 'undefined') {
//                        that.setMap(that.__connectaGeo.__getObjMapByName(configMap.name));
//                        clearInterval(interval);
//                    }
//                }, 20);
//            }
//            
//        };

        this.createMap = function (mapTypeId, mapDivId) {
            var that = this;
            var configMap = null;
            var deferred = $q.defer();
            //Openlayers
            if (mapTypeId == 1) {
                configMap = this.__connectaGeo.__mapsConfig.Openlayers.Map.configMap;
                configMap.divMap = mapDivId ? mapDivId : "map-view";
                this.__connectaGeo.__createObjMap(configMap, "__createControl", this.__connectaGeo.__mapsConfig.Openlayers.Controls.controlZB);
                
                

                var interval = setInterval(function () {
                    var map = that.__connectaGeo.__getObjMapByName(configMap.name);
                    if (angular.isDefined(map)) {
                        deferred.resolve(map);
                        clearInterval(interval);
                    }
                }, 100);
            }
            
            return deferred.promise;
        };


//        this.setMap = function (Map) {
//            this.map = Map;
//        };


    });
});