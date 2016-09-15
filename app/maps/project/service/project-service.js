define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("ProjectService", function ($http, mapsResources) {

        var url = mapsResources.project;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (project) {
            return $http.post(url, project);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

    });

});
