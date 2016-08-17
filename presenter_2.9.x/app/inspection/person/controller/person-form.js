define([
    'connecta.inspection',
    'inspection/person/service/person-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('PersonFormController', function (
            $scope, $routeParams, PersonService, notify, $location) {

        $scope.person = null;

        if ($routeParams.id) {
            PersonService.get($routeParams.id).success(function (data) {
                $scope.person = data;
            });
        }

        $scope.submit = function () {
            PersonService.save($scope.person).then(function () {
                $location.path('inspection/person');
            }, function (response) {
            });
        };

    });
});