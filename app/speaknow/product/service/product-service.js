define([
    'connecta.speaknow'
], function (speaknow) {
    return speaknow.lazy.service('ProductService', function (speaknowResources, $http) {

        this.list = function (params) {
            var url = speaknowResources.product + "/list";
            return $http.get(url, {params: params});
        };

        this.get = function (id) {
            var url = speaknowResources.product + "/" + id;
            return $http.get(url);
        };

        this.save = function (product, image) {
            var url = speaknowResources.product + "/save";
            var fd = new FormData();
            fd.append('image', image);
            fd.append('product', JSON.stringify(product));
            return $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            });
        };

        this.searchProductReference = function (parameter) {
            var url = speaknowResources.product + "/find/" + parameter;
            return $http.get(url);
        };

        this.getMeasureTypes = function () {
            var url = speaknowResources.product + "/measureTypes";
            return $http.get(url);
        };

        this.getCategories = function () {
            var url = speaknowResources.product + "/categories";
            return $http.get(url);
        };
    });
});