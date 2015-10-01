define([
    'connecta.inspection',
    'inspection/medias/service/media-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('MediaFormController', function (
            $scope, MediaService, notify, $location, $translate, $routeParams) {

        $scope.media = {
            type: "TEST"
        };
        $scope.file = null;

        if ($routeParams.id) {
            MediaService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.media = data;
            });
        }

        $scope.submit = function () {

            if ($scope.file) {
                var type = $scope.file.name.split('.');
                type = type[type.length - 1];
                $scope.media.extension = type.toUpperCase();
            }

            MediaService.save($scope.media, $scope.file).then(function () {
                $location.path('inspection/medias');
            }, function (response) {
            });
        };

        $scope.fileDropped = function (files) {
            if (files && files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.file = files[0];
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            } else {
                $translate('DOCUMENT.INVALID_DOCUMENT').then(function (text) {
                    notify.warning(text);
                });
            }
        };

    });
});