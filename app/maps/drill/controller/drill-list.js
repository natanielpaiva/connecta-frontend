define([
    'connecta.inspection',
    'inspection/supplier/service/supplier-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('SupplierListController', function (
            $scope, SupplierService, ngTableParams, $location, notify, $translate, $modalTranslate) {



        $scope.remove = function (id) {            
            SupplierService.delete(id).then(function () {
                $translate('SUPPLIER.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);                    
                    $location.path('inspection/supplier');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('SUPPLIER.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/supplier');
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
        $modalTranslate($scope.modalParams, 'title', 'SUPPLIER.TITLE_CONFIRM_DELETE');
        $modalTranslate($scope.modalParams, 'text', 'SUPPLIER.CONFIRM_DELETE');


        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return SupplierService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);  
                });
            },
            counts: [10, 30, 50, 100]
        });
        
    });
});