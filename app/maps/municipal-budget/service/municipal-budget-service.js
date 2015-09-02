define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('MunicipalBudgetService', function (mapsResources, $http) {

        this.list = function () {
            var url = mapsResources.municipalBudget;
            return $http.get(url);
        };


        this.get = function (id) {
            var url = mapsResources.municipalBudget + "/" + id;
            return $http.get(url);
        };

    });
});
