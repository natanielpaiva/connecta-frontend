define([
    'connecta.inspection',
    'inspection/project/service/project-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ProjectViewController', 
            function ($scope, ProjectService, notify, $routeParams, $location, $translate) {

        ProjectService.get($routeParams.id).success(function (data) {
            $scope.project = data;
        });

    });
});