define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("GeoLayerService", function ($http, mapsResources) {

        var url = mapsResources.layer;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (geoLayer) {
            return $http.post(url, geoLayer);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

        this.update = function (id, geoLayer){
          return $http.put(url + '/' + id, geoLayer);
        };

    });

});
