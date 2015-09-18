define([
    'connecta.inspection',
    'inspection/expense/service/expense-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ExpenseListController', function (
            $scope, ExpenseService, ngTableParams, notify, $translate, $location) {
        
        
        $scope.expenses=null;
            
            
        $scope.remove = function (id) {
            console.info("REMOVE", id);
            ExpenseService.delete(id).then(function () {
                $translate('EXPENSE.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/expense');
                });
            }, function (response) {
                $translate('EXPENSE.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/expense');
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

        
        $scope.search = {
            name: ''
        };
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ExpenseService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        
        
        
          ExpenseService.list().then(function (response) {
            $scope.expenses = response.data;
        }, function (response) {
        });
        
    });
});