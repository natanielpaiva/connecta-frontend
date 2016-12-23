define([
    'connecta.inspection',
    'inspection/client/service/client-service',
    'inspection/person/service/person-service',
    'inspection/client-address/service/client-address-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('ClientFormController', function (
            $scope, $routeParams, ClientService, ClientAddressService, notify, $location, $modal, $rootScope, PersonService) {

        $scope.client = null;
        $scope.isEditing = false;
        $rootScope.clientAddresses = [];
        $scope.typesRoading = [];
        $scope.typesFeeding =[];
        $scope.typesLodging =[];
        $scope.typesAerialTransport =[];

        ClientService.getRoading().then(function (response) {
            $scope.typesRoading = response.data;
        });
        
        ClientService.getFeeding().then(function (response) {
            $scope.typesFeeding = response.data;
        });
        
        ClientService.getLodging().then(function (response) {
            $scope.typesLodging = response.data;
        });
        
        ClientService.getAerialTransport().then(function (response) {
            $scope.typesAerialTransport = response.data;
        });
        
        

        $scope.deleteClientAddress = function (clientAddress) {
            var objAddress = null;
            for (var obj in $rootScope.clientAddresses) {
                if ($rootScope.clientAddresses[obj].description == clientAddress.description) {
                    objAddress = $rootScope.clientAddresses[obj];
                }
            }
            var index = $rootScope.clientAddresses.indexOf(objAddress);
            $rootScope.clientAddresses.splice(index, 1);
        };

        $scope.openModal = function (address) {
            if (typeof address != 'undefined') {
                var sAddress = "";
                for (var obj in $rootScope.clientAddresses) {
                    if ($rootScope.clientAddresses[obj].description == address.description) {
                        sAddress = $rootScope.clientAddresses[obj];
                    }
                }
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/inspection/client/template/client-address-form.html",
                controller: function ($scope, $rootScope) {
                    $scope.clientAddress = address;
                    $scope.ok = function (clientAddress) {
                        if (typeof address != 'undefined') {
                            var index = $rootScope.clientAddresses.indexOf(sAddress);
                            $rootScope.clientAddresses.splice(index, 1);
                        }
                        $rootScope.clientAddresses.push(clientAddress);
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };

        $scope.deleteResponsible = function (responsible) {
            var objResponsible = null;
            for (var obj in $rootScope.responsibles) {
                if ($rootScope.responsibles[obj].name == responsible.name) {
                    objResponsible = $rootScope.responsibles[obj];
                }
            }
            var index = $rootScope.responsibles.indexOf(objResponsible);
            $rootScope.responsibles.splice(index, 1);
        };

        $scope.openModalResponsible = function (responsible) {
            if (typeof responsible != 'undefined') {
                var objResponsible = "";
                for (var obj in $rootScope.responsibles) {
                    if ($rootScope.responsibles[obj].name == responsible.name) {
                        objResponsible = $rootScope.responsibles[obj];
                    }
                }
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/inspection/client/template/client-responsible-form.html",
                controller: function ($scope, $rootScope) {
                    PersonService.list().then(function (response) {
                        $scope.responsibles = response.data;
                    }, function (response) {
                        console.info("error", response);
                    });


                    $scope.responsible = responsible;
                    $scope.ok = function (responsible) {

                        if (typeof $rootScope.responsibles != 'undefined') {
                            var index = $rootScope.responsibles.indexOf(objResponsible);
                            $rootScope.responsibles.splice(index, 1);
                        } else {
                            $rootScope.responsibles = [];
                        }

                        $rootScope.responsibles.push(responsible);
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };

        //Options para BO
        if ($routeParams.id) {
            $scope.isEditing = true;
            ClientService.get($routeParams.id).success(function (data) {
                $scope.client = data;
            });
        }

        $scope.submit = function () {
            $scope.client.addresses = $rootScope.clientAddresses;

            ClientService.save($scope.client).then(function () {
                $location.path('inspection/client');
            }, function () {

            });
        };

    });
});