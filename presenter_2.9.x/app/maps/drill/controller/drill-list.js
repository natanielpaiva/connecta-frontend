define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('DrillListController', function (
            $scope, DrillService, ngTableParams, $location, notify, $translate, $modalTranslate) {



        $scope.remove = function (id) {            
            DrillService.delete(id).then(function () {
                $translate('SUPPLIER.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);                    
                    $location.path('maps/drill');
                    $scope.tableParams.reload();
                });
            }, function (response) {
                $translate('SUPPLIER.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('maps/drill');
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
                return DrillService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);  
                });
            },
            counts: [10, 30, 50, 100]
        });
        
    });
});