define([
    'connecta.inspection',
    'inspection/client/service/client-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ClientListController', function (
            $scope, ClientService, ngTableParams, $location, notify, $translate, $modalTranslate) {


        $scope.remove = function (id) {            
            ClientService.delete(id).then(function () {
                $translate('CLIENT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);                    
                    $location.path('inspection/client');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('CLIENT.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/client');
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
        $modalTranslate($scope.modalParams, 'title', 'CLIENT.TITLE_CONFIRM_DELETE');
        $modalTranslate($scope.modalParams, 'text', 'CLIENT.CONFIRM_DELETE');


        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ClientService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);  
                });
            },
            counts: [10, 30, 50, 100]
        });
        
    });
});