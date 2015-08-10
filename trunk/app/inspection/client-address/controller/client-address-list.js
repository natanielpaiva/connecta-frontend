define([
    'connecta.inspection',
    'inspection/client-address/service/client-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ClientListController', function (
            $scope, ClientAddressService, ngTableParams, $location, notify, $translate, $modalTranslate) {



        $scope.remove = function (id) {            
            ClientAddressService.delete(id).then(function () {
                $translate('CLIENT_ADDRESS.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/client-address');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('CLIENT_ADDRESS.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/client-address');
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
        $modalTranslate($scope.modalParams, 'title', 'CLIENT_ADDRESS.TITLE_CONFIRM_DELETE');
        $modalTranslate($scope.modalParams, 'text', 'CLIENT_ADDRESS.CONFIRM_DELETE');


        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ClientAddressService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

        ClientAddressService.list().then(function (response) {            
            $scope.clientAddresses = response.data;


        }, function (response) {
        });

    });
});