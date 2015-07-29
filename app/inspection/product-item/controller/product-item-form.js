define([
    'connecta.inspection',
    'inspection/product-item/service/product-item-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ProductItemFormController', function (
            $scope, $routeParams, ProductItemService, notify, $location, $modalTranslate) {

        $scope.productItem = {};

        if ($routeParams.id) {
            ProductItemService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.productItem = data;
            });
        }


        $scope.submit = function () {
            ProductItemService.save($scope.productItem).then(function () {
                $location.path('inspection/product/item');
            }, function (response) {
            });
        };

    });
});