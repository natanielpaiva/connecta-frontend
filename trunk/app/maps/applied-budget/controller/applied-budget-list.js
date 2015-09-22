define([
    'connecta.maps',
    'maps/applied-budget/service/applied-budget-service'
], function (maps) {
    return maps.lazy.controller('AppliedBudgetListController', function ($scope, AppliedBudgetService) {

        $scope.appliedBudgets = null;

        AppliedBudgetService.list().then(function (response) {
            $scope.appliedBudgets = response.data;
        }, function (response) {
        });

    });
});