define([
    "connecta.maps",
    '../../helper/url'
], function (maps, urlHelper) {

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

        this.list = function (params) {
            var queryString = params ? urlHelper.queryStringify(params) : '';
            return $http.get(url + queryString);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

        this.getLayersBySpatialDS = function (id) {
            return $http.get(url + '/' + id + '/layers');
        };
        this.testeConnectionObiee = function (params) {
            var url = 'http://172.16.0.31:8080/connecta-portal/obiee/login';
            return  $http.post(url, params);
        };


    });

});
