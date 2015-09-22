define([
    'connecta.inspection',
    'inspection/client/service/client-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ClientViewController', function ($scope, ClientService, notify, $routeParams, $location, $translate) {

        ClientService.get($routeParams.id).then(function (response) {
            $scope.client = response.data;
        });

    });
});