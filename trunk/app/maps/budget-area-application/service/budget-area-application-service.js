define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('BudgetAreaApplicationService', function (mapsResources, $http) {

        this.list = function () {
            var url = mapsResources.budgetAreaApplication;
            return $http.get(url);
        };     

    });
});
