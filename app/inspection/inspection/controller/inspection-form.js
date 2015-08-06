define([
    'connecta.inspection',
    'inspection/inspection/service/inspection-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('InspectionFormController', function (
            $scope, InspectionService, notify, $routeParams, $translate, $location, $modalTranslate) {

        $scope.inspection = {
            
        };
        $scope.prevDocuments = [];
        $scope.contDocuments = [];
        $scope.standards = [];

        if ($routeParams.id) {
            InspectionService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.inspection = data;
            });
        }

        $scope.submit = function () {
            InspectionService.save($scope.project, $scope.files).then(function () {
                $translate('INSPECTION.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection');
                });
            }, function (response) {
            });
        };

    });
});