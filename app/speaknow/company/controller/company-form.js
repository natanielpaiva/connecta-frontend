define([
    'connecta.speaknow',
    'speaknow/company/service/company-service'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyFormController', function ($scope, CompanyService, speaknowResources, $location, $routeParams) {

        $scope.company = {};
        $scope.contactMail = {};
        $scope.contactPhone = {};

        if ($routeParams.id) {
            $scope.isEditing = true;
            CompanyService.get($routeParams.id).success(function (data) {
                $scope.company = data;
                $scope.fileQuad = "data:image/jpeg;base64," + $scope.company.imageQuad;
                $scope.fileRect = "data:image/jpeg;base64," + $scope.company.imageRect;
            });
        }

        $scope.submit = function () {
            CompanyService.save($scope.company).then(function () {
                $location.path('speaknow/company');
            }, function (response) {});
        };

        $scope.fileQuadDropped = function (files) {
            if (files && files.length) {

                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.company.imageQuad = e.target.result.replace(new RegExp(speaknowResources.regexBase64), "");
                    $scope.fileQuad = "data:image/jpeg;base64," + $scope.company.imageQuad;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
        
        $scope.fileRectDropped = function (files) {
            if (files && files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.company.imageRect = e.target.result.replace(new RegExp(speaknowResources.regexBase64), "");
                    $scope.fileRect = "data:image/jpeg;base64," + $scope.company.imageRect;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
    });
});