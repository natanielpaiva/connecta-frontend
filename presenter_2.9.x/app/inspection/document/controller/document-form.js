define([
    'connecta.inspection',
    'inspection/document/service/document-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('DocumentFormController', function (
            $scope, DocumentService, notify, $location, $translate, $routeParams) {

        $scope.document = {
            type: "TEST"
        };
        $scope.file = null;

        if ($routeParams.id) {
            DocumentService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.document = data;
            });
        }

        $scope.submit = function () {

            if ($scope.file) {
                var type = $scope.file.name.split('.');
                type = type[type.length - 1];
                $scope.document.extension = type.toUpperCase();
            }

            DocumentService.save($scope.document, $scope.file).then(function () {
                $location.path('inspection/document');
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