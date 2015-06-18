define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerSourceTypeService', function (mapsResources, $http) {

        this.list = function () {
            var url = mapsResources.layerSourceType;
            return $http.get(url);
        };


        this.get = function (id) {
            var url = mapsResources.layerSourceType + "/" + id;
            return $http.get(url);
        };

    });
});