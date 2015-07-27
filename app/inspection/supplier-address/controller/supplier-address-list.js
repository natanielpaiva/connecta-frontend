define([
    'connecta.inspection',
    'inspection/supplier-address/service/supplier-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('SupplierListController', function (
            $scope, SupplierAddressService, ngTableParams, $location, notify, $translate, $modalTranslate) {



        $scope.remove = function (id) {            
            SupplierAddressService.delete(id).then(function () {
                $translate('SUPPLIER_ADDRESS.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/supplier-address');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('SUPPLIER_ADDRESS.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/supplier-address');
                });
            });
        };


        //Parâmetros da Modal
        $scope.modalParams = {
            title: "",
            text: "",
            size: 'sm',
            success: $scope.remove
        };


        //translate das propriedades da modal
        $modalTranslate($scope.modalParams, 'title', 'SUPPLIER_ADDRESS.TITLE_CONFIRM_DELETE');
        $modalTranslate($scope.modalParams, 'text', 'SUPPLIER_ADDRESS.CONFIRM_DELETE');


        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return SupplierAddressService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

        SupplierAddressService.list().then(function (response) {            
            $scope.supplierAddresses = response.data;


        }, function (response) {
        });

    });
});