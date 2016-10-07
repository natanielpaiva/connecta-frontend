define([
    'connecta.maps',
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service('ViewerService', function ($http, mapsResources) {

        var url = mapsResources.viewer;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (viewer) {
            return $http.post(url, viewer);
        };

        this.update = function (id, viewer) {
            return $http.put(url + '/' + id, viewer);
        };

        this.list = function (params) {
            return $http.get(url + params);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

    });

});
