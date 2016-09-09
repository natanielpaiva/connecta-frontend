define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("ProjectService", function ($http, mapsResources) {

        var url = mapsResources.project;

        this.get = function (id) {

            return $http.get(url + '/' + id);

        };

        this.save = function (layer) {

            return $http.post(url, layer);

        };

        this.list = function () {

            return $http.get(url);

        };

    });

});
