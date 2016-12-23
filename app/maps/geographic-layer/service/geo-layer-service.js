define([
    "connecta.maps",
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service("GeoLayerService", function ($http, mapsResources) {

        var url = mapsResources.layer;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.query = function (params) {
          var queryString = urlHelper.queryStringify(params);
          return $http.get(url + '/query' + queryString);
        };

        this.save = function (geoLayer) {
            return $http.post(url, geoLayer);
        };

        this.list = function (params) {
            return $http.get(url + params);
        };

        this.update = function (id, geoLayer) {
            return $http.put(url + '/' + id, geoLayer);
        };

        this.getLayersByDS = function (id) {
            return $http.get(url + '?filter={"spatialDataSourceId":"' + id + '"}');
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

    });

});
