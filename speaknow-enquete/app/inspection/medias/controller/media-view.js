define([
    'connecta.inspection',
    'inspection/medias/service/media-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('MediaViewController', function ($scope, MediaService, $routeParams, $location, $translate) {

        MediaService.get($routeParams.id).then(function (response) {
            $scope.media = response.data;
        });

    });
});