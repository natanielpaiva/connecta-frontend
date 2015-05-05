define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyFormController', 
            function ($scope, CompanyService, notify, regexBase64, $location, $routeParams, $translate) {

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
            if($scope.fileQuad === undefined){
                $scope.quadInvalid = true;
            } else if($scope.fileRect === undefined){
                $scope.rectInvalid = true;
            } else {
                CompanyService.save($scope.company).then(function () {
                    $translate('COMPANY.SUCCESS').then(function (text) {
                        notify.success(text);
                    });
                    $location.path('speaknow/company');
                }, function (response) {});
            }
        };

        $scope.fileQuadDropped = function (files) {
            if (files && files.length) {

                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.company.imageQuad = e.target.result.replace(new RegExp(regexBase64), "");
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
                    $scope.company.imageRect = e.target.result.replace(new RegExp(regexBase64), "");
                    $scope.fileRect = "data:image/jpeg;base64," + $scope.company.imageRect;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
    });
});