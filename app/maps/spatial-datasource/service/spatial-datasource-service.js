define([
  "connecta.maps"
], function (maps) {

    return maps.lazy.service("SpatialDataSourceService", function ($http, mapsResources) {

        var url = mapsResources.spatialDataSource;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (datasource) {
            return $http.post(url, datasource);
        };

        this.update = function (datasource) {
            return $http.put(url, datasource);
        };

        this.list = function (params) {
            return $http.post(url, params);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

    });

});
