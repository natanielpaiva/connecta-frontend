define([
    'connecta.inspection',
    'inspection/product-item/service/product-item-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ProductItemViewController', 
            function ($scope, ProductItemService, notify, $routeParams, $location, $translate) {

        ProductItemService.get($routeParams.id).success(function (data) {
            $scope.productItem = data;
        });

    });
});