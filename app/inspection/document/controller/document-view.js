define([
    'connecta.inspection',
    'inspection/document/service/document-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('DocumentViewController', function ($scope, DocumentService, $routeParams, $location, $translate) {

        DocumentService.get($routeParams.id).then(function (response) {
            $scope.document = response.data;
        });

    });
});