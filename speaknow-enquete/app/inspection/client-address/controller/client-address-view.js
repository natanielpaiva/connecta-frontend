define([
    'connecta.inspection',
    'inspection/client-address/service/client-address-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ClientAddressViewController', function ($scope, ClientAddressService, notify, $routeParams, $location, $translate) {


        ClientAddressService.get($routeParams.id).then(function (response) {
            $scope.clientAddress = response.data;
        });

    });
});