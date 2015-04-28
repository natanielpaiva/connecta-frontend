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
            });
        }

        $scope.submit = function () {
            CompanyService.save($scope.company).then(function () {
                $location.path('speaknow/company');
            }, function (response) {});
        };

        $scope.fileQuadDropped = function (files) {
            if (files && files.length) {
                $scope.fileQuad = files[0];
                
                $scope.fileQuad.binary = '';
//                $("#file-quad").html($scope.fileQuad.name);
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.company.imageQuad = e.target.result.replace(new RegExp(speaknowResources.regexBase64), "");
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
        
        $scope.fileRectDropped = function (files) {
            if (files && files.length) {
                $scope.fileRect = files[0];
//                $("#file-rect").html($scope.fileRect.name);
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.company.imageRect = e.target.result.replace(new RegExp(speaknowResources.regexBase64), "");
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
    });
});