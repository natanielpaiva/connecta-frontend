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

        this.update = function (id, datasource) {
            return $http.put(url + '/' + id, datasource);
        };

        this.search = function (queryString) {
            return $http.get(url + queryString);
        };

        this.listAll = function (){
          return $http.get(url + '/listAll');
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

        this.getLayersBySpatialDS = function(id) {
          return $http.get(url + '/' + id + '/layers');
        };

    });

});
