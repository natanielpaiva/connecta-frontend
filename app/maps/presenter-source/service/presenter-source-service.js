define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('PresenterSourceService', function (mapsResources, $http) {
      
        this.get = function (id) {
            var url = mapsResources.presenterSource + "/" + id;
            return $http.get(url);
        };

        this.list = function () {
            var url = mapsResources.presenterSource;
            return $http.get(url);
        };


        this.save = function (presenterSource) {            
            return $http.post(mapsResources.presenterSource, presenterSource);
        };

        this.delete = function (id) {
            var url = mapsResources.presenterSource + '/' + id;
            return $http.delete(url);
        };

    });
});