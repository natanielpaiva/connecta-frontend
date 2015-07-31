define([
    'connecta.inspection',
    'inspection/client-address/service/client-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ClientAddressFormController', function (
            $scope, $routeParams, ClientAddressService, notify, $location) {

        $scope.clientAddress = null;
        $scope.isEditing = false;
        
     

        if ($routeParams.id) {
            $scope.isEditing = true;
            ClientAddressService.get($routeParams.id).success(function (data) {
                $scope.clientAddress = data;
            });
        }

        $scope.submit = function () {
            ClientAddressService.save($scope.clientAddress).then(function () {

                $location.path('inspection/client-address');
            }, function (response) {
            });
        };

    });
});