define([
    'connecta.inspection',
    'inspection/project/service/project-service',
    'portal/layout/service/notify',
], function (inspection) {
    return inspection.lazy.controller('ProjectFormController', function (
            $scope, $routeParams, ProjectService, notify, $location, $translate) {

        $scope.project = {};

        if ($routeParams.id) {
            ProjectService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.project = data;
            });
        }


        $scope.submit = function () {
            ProjectService.save($scope.project).then(function () {
                 $translate('PROJECT.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/project');
                });
            }, function (response) {
            });
        };

    });
});