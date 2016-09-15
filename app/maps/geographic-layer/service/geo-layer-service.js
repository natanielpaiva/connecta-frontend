define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("GeoLayerService", function ($http, mapsResources) {

        var url = mapsResources.layer;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (layer) {
            return $http.post(url, layer);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

    });

});
