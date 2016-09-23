define([
    "connecta.maps",
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service("ProjectService", function ($http, mapsResources) {

        var url = mapsResources.project;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (project) {
            return $http.post(url, project);
        };

        this.list = function (params) {
            var queryString = params ? urlHelper.queryStringify(params) : '';
            return $http.get(url + queryString);
        };

        this.listAll = function (){
          return $http.get(url + '/listAll');
        };

    });

});
