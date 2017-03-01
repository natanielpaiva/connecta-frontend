define([
    'connecta.inspection',
    'inspection/instrument/service/instrument-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('InstrumentViewController', function ($scope, InstrumentService, notify, $routeParams, $location, $translate) {


        InstrumentService.get($routeParams.id).then(function (response) {
            response.data.calibrationDate = new Date(response.data.calibrationDate).toLocaleDateString("pt-BR");
            response.data.dueDate = new Date(response.data.dueDate).toLocaleDateString("pt-BR");
            $scope.instrument = response.data;
        });

    });
});