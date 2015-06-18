define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerSourceService', function (mapsResources, $http) {
        
         var layerSourceTypeConfig = {
            GEOSERVER: {
                name: 'Geoserver',                
                icon:'icon-geoserver'
            },
            ARCGISSERVER: {
                name: 'ArcGisServer',                
                icon:'icon-esri'
            },
            MAPVIEWER: {
                name: 'Mapviewer',                
                icon:'icon-globe'
            },
            MAPSERVER: {
                name: 'Mapserver',
                icon:'icon-map2'
            }
        };
        
        this.getTypes = function(){
          return layerSourceTypeConfig;  
        };
        
        this.get = function (id) {
            var url = mapsResources.layerSource + "/" + id;
            return $http.get(url);
        };

        this.list = function () {
            var url = mapsResources.layerSource;
            return $http.get(url);
        };


        this.save = function (layerSource) {            
            return $http.post(mapsResources.layerSource, layerSource);
        };

        this.delete = function (id) {
            var url = mapsResources.layerSource + '/' + id;
            return $http.delete(url);
        };

    });
});