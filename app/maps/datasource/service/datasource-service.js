define([
  "connecta.maps"
], function (maps) {

  return maps.lazy.service("DatasourceService", function ($http, mapsResources) {

    var url = mapsResources.dataSource;

    this.get = function (id) {
      return $http.get(url + '/' + id);
    };

    this.save = function (datasource) {
      return $http.post(url, datasource);
    };

    this.update = function (id, datasource) {
      return $http.put(url + '/' + id, datasource);
    };

    this.list = function (queryString) {
      return $http.get(url + queryString);
    };

    this.delete = function(id){
      return $http.delete(url, id);
    };

  });

});
