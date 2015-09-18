define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'maps/drill-level/service/drill-level-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('DrillFormController', function (
            $scope, $routeParams, DrillService, DrillLevelService, notify, $translate,$location, $modal, $rootScope) {

        $scope.drill = null;
        $scope.isEditing = false;
        $rootScope.supplierAddresses = [];
        $rootScope.responsibles = [];

        $scope.deleteSupplierAddress = function (supplierAddress) {

            if ($scope.isEditing) {
                DrillService.delete(supplierAddress.id).then(function () {

                }, function () {

                });
            }

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


        $scope.deleteResponsible = function (responsible) {
            var objResponsible = null;
            for (var obj in $rootScope.responsibles) {
                if ($rootScope.responsibles[obj].name == responsible.name) {
                    objResponsible = $rootScope.responsibles[obj];
                }
            }
            var index = $rootScope.responsibles.indexOf(objResponsible);
            $rootScope.responsibles.splice(index, 1);
        };

        $scope.openModalResponsible = function (responsible) {
            if (typeof responsible != 'undefined') {
                var objResponsible = "";
                for (var obj in $rootScope.responsibles) {
                    if ($rootScope.responsibles[obj].name == responsible.name) {
                        objResponsible = $rootScope.responsibles[obj];
                    }
                }
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/inspection/supplier/template/supplier-responsible-form.html",
                controller: function ($scope, $rootScope) {
                    PersonService.list().then(function (response) {
                        $scope.responsibles = response.data;
                    }, function (response) {
                        console.info("error", response);
                    });


                    $scope.responsible = responsible;
                    $scope.ok = function (responsible) {

                        if (typeof responsible != 'undefined') {
                            var index = $rootScope.responsibles.indexOf(objResponsible);
                            $rootScope.responsibles.splice(index, 1);
                        }

                        $rootScope.responsibles.push(responsible);
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };

        if ($routeParams.id) {
            $scope.isEditing = true;
            SupplierService.get($routeParams.id).success(function (data) {
                $scope.supplier = data;
                $rootScope.supplierAddresses = $scope.supplier.supplierAddresses;
                $rootScope.responsibles = $scope.supplier.people;

            });
        }

        $scope.submit = function () {
            $scope.supplier.supplierAddresses = $rootScope.supplierAddresses;


            SupplierService.save($scope.supplier).then(function (response) {

                if (!$scope.isEditing) {
                    $scope.supplier = response.data;
                    $scope.supplier.people = $rootScope.responsibles;
                    SupplierService.save($scope.supplier).then(function () {

                    }, function () {

                    });
                }

                $translate('SUPPLIER.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/supplier');
                    $scope.tableParams.reload();
                });

            }, function () {
                
                $translate('SUPPLIER.ERROR_SAVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/supplier');
                });

            });
        };

    });
});