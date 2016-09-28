define([
    'connecta.maps',
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service('AnalysisService', function ($http, mapsResources) {

        var url = mapsResources.analysis;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (analysis) {
            return $http.post(url, analysis);
        };

        this.update = function (id, analysis) {
            return $http.put(url + '/' + id, analysis);
        };

        this.list = function (params) {
            var queryString = params ? urlHelper.queryStringify(params) : '';
            return $http.get(url + queryString);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

    });

});
