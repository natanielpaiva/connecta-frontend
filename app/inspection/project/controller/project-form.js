define([
    'connecta.inspection',
    'inspection/project/service/project-service',
    'inspection/client/service/client-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ProjectFormController', function (
            $scope, $routeParams, ProjectService, ClientService, notify, $location, $translate) {

        $scope.files = [];
        $scope.clients = [];
        $scope.project = {
            documents: []
        };

        ClientService.list().success(function (data) {
            $scope.clients = data;
        });

        if ($routeParams.id) {
            ProjectService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.project = data;
            });
        }

        $scope.submit = function () {
            ProjectService.save($scope.project, $scope.files).then(function () {
                $translate('PROJECT.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/project');
                });
            }, function (response) {
            });
        };

    });
});