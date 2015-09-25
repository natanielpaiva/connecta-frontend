define([
    'connecta.inspection',
    'inspection/expense/service/expense-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ExpenseFormController', function (
            $scope, $routeParams, ExpenseService, notify, $location) {

        $scope.expense = null;

        if ($routeParams.id) {
            ExpenseService.get($routeParams.id).success(function (data) {
                $scope.expense = data;
            });
        }

        $scope.submit = function () {
            ExpenseService.save($scope.expense).then(function () {
                $location.path('inspection/expense');
            }, function (response) {
            });
        };

    });
});