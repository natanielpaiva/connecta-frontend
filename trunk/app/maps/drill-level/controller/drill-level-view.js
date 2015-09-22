define([
    'connecta.inspection',
    'inspection/supplier-address/service/supplier-address-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('DrillLevelViewController', function ($scope, SupplierAddressService, notify, $routeParams, $location, $translate) {


        SupplierAddressService.get($routeParams.id).then(function (response) {
            $scope.supplierAddress = response.data;
        });

    });
});