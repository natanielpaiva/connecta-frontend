define([
    'connecta.inspection',
    'inspection/supplier/service/supplier-service',
    'inspection/supplier-address/service/supplier-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('SupplierFormController', function (
            $scope, $routeParams, SupplierService, SupplierAddressService, notify, $location, $modal, $rootScope) {

        $scope.supplier = null;
        $scope.isEditing = false;
        $rootScope.supplierAddresses = [];

        $scope.deleteSupplierAddress = function (supplierAddress) {
            var objAddress = null;
            for (var obj in $rootScope.supplierAddresses) {
                if ($rootScope.supplierAddresses[obj].description == supplierAddress.description) {
                    objAddress = $rootScope.supplierAddresses[obj];
                }
            }
            var index = $rootScope.supplierAddresses.indexOf(objAddress);
            $rootScope.supplierAddresses.splice(index, 1);
        };

        $scope.openModal = function (address) {
            if (typeof address != 'undefined') {
                var sAddress = "";
                for (var obj in $rootScope.supplierAddresses) {
                    if ($rootScope.supplierAddresses[obj].description == address.description) {
                        sAddress = $rootScope.supplierAddresses[obj];
                    }
                }
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/inspection/supplier/template/supplier-address-form.html",
                controller: function ($scope, $rootScope) {
                    $scope.supplierAddress = address;
                    $scope.ok = function (supplierAddress) {
                        if (typeof address != 'undefined') {
                            var index = $rootScope.supplierAddresses.indexOf(sAddress);
                            $rootScope.supplierAddresses.splice(index, 1);                            
                        }
                        $rootScope.supplierAddresses.push(supplierAddress);
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };

        //Options para BO
        if ($routeParams.id) {
            $scope.isEditing = true;
            SupplierService.get($routeParams.id).success(function (data) {
                $scope.supplier = data;
            });
        }

        $scope.submit = function () {
            $scope.supplier.supplierAddresses = $rootScope.supplierAddresses;



            SupplierService.save($scope.supplier).then(function () {
                $location.path('inspection/supplier');
            }, function () {

            });
        };

    });
});