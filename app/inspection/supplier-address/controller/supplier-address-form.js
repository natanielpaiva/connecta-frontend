define([
    'connecta.inspection',
    'inspection/supplier-address/service/supplier-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('SupplierAddressFormController', function (
            $scope, $routeParams, SupplierAddressService, notify, $location) {

        $scope.supplierAddress = null;
        $scope.isEditing = false;
        
     

        if ($routeParams.id) {
            $scope.isEditing = true;
            SupplierAddressService.get($routeParams.id).success(function (data) {
                $scope.supplierAddress = data;
            });
        }

        $scope.submit = function () {
            SupplierAddressService.save($scope.supplierAddress).then(function () {

                $location.path('inspection/supplier-address');
            }, function (response) {
            });
        };

    });
});