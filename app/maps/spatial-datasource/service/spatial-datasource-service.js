define([
  "connecta.maps"
], function (maps) {

  return maps.lazy.service("SpatialDataSourceService", function ($http, mapsResources) {

    // var url = mapsResources.spatialDataSource;
    var url = "http://localhost:8080/admin/spatial-data-source";

    this.get = function (id) {
      return $http.get(url + '/' + id);
    };

    this.save = function (datasource) {
      return $http.post(url, datasource);
    };

    this.update = function (datasource) {
      return $http.patch(url, datasource);
    };

    this.list = function () {
      return $http.get(url);
    };

    this.delete = function (id) {
      return $http.delete(url + '/' + id);
    };

  });

});
