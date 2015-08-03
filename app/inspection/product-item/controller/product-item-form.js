define([
    'connecta.inspection',
    'inspection/product-item/service/product-item-service',
    'inspection/project/service/project-service',
    'inspection/supplier/service/supplier-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ProductItemFormController', function (
            $scope, $routeParams, ProductItemService, ProjectService, SupplierService, notify, $location, $modalTranslate) {

        $scope.productItem = {};
        $scope.projects = [];
        $scope.supplies = [];

        ProjectService.list().success(function (data) {
            $scope.projects = data;
        });
        
        SupplierService.list().success(function (data) {
            $scope.supplies = data;
        });

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