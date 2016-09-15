define([
    "connecta.maps"
], function (maps) {

    return maps.lazy.service("AnalysisService", function ($http, mapsResources) {

        var url = mapsResources.analysis;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (analysis) {
            return $http.post(url, analysis);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };
    });

});
