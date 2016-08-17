define([
    'connecta.inspection',
    'inspection/expense/service/expense-service',
    'portal/layout/service/notify'
], function (expense) {
    return expense.lazy.controller('ExpenseViewController', function ($scope, ExpenseService, notify, $routeParams, $location, $translate) {

        ExpenseService.get($routeParams.id).success(function (data) {
            $scope.expense = data;
        });

    });
});