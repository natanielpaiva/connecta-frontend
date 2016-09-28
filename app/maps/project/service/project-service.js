define([
    "connecta.maps",
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service("ProjectService", function ($http, mapsResources) {

        var url = mapsResources.project;

        this.get = function (id) {
            return $http.get((id) ? url + '/' + id : url);
        };

        this.save = function (project) {

            if (project._id) {
                return $http.put(url + "/" + project._id, project);
            }

            return $http.post(url, project);
        };

        this.list = function (params) {
            return $http.get(url + params);
        };

        this.listAll = function () {
            return $http.get(url + '/listAll');
        };

        this.initCatalogObiee = function () {
            return $http.get(url + '/teste/catalog');
        };

        this.getChildCatalogObiee = function (path) {
            path = '?' +path;
            return $http.get(url + '/teste/catalog' + path);
        };

        this.listAnalysisConnecta = function() {
            var url = 'http://connectad.cds.com.br/connecta-presenter/analysis';
            return $http.get(url);
        };

        this.getAnalysisConnecta = function(id) {
            var url = 'http://connectad.cds.com.br/connecta-presenter/analysis/';
            return $http.get(url + id);
        };


    });

});
