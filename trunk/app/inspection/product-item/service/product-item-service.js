define([
    'connecta.inspection'
], function (inspection) {
    return inspection.lazy.service('ProductItemService', function (inspectionResource, $http) {

        this.get = function (id) {
            var url = inspectionResource.productItem + "/" + id;
            return $http.get(url);
        };

        this.list = function (params) {
            var url = inspectionResource.productItem;
            return $http.get(url, {params: params});
        };

        this.save = function (person) {
            var url = inspectionResource.productItem;
            return $http.post(url, person);
        };

        this.delete = function (id) {
            var url = inspectionResource.productItem + '/' + id;
            return $http.delete(url);
        };

    });
});