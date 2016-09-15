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

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

    });

});
