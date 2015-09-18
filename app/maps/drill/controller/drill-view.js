define([
    'connecta.inspection',
    'inspection/supplier/service/supplier-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('SupplierViewController', function ($scope, SupplierService, notify, $routeParams, $location, $translate) {


        SupplierService.get($routeParams.id).then(function (response) {
            $scope.supplier = response.data;
        });

    });
});