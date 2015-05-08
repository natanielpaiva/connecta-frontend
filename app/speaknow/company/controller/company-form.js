define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyFormController', 
            function ($scope, CompanyService, notify, speaknowResources, regexBase64, $location, $routeParams, $translate) {

        $scope.company = {};
        $scope.contactMail = {};
        $scope.contactPhone = {};
        $scope.baseUrl = speaknowResources.base;
        
        if ($routeParams.id) {
            $scope.isEditing = true;
            CompanyService.get($routeParams.id).success(function (data) {
                $scope.company = data;
            });
        }

        $scope.submit = function () {
            if($scope.fileQuad === undefined){
                $scope.quadInvalid = true;
            } else if($scope.fileRect === undefined){
                $scope.rectInvalid = true;
            } else {
                CompanyService.save($scope.fileQuad, $scope.fileRect, $scope.company).then(function () {
                $translate('COMPANY.SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('speaknow/company');
                });
            }, function (response) {});
            }
        };

        $scope.fileQuadDropped = function (files) {
            $scope.fileQuad = files[0];
            if (files && files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.imageQuad = e.target.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
        
        $scope.fileRectDropped = function (files) {
            $scope.fileRect = files[0];
            if (files && files.length) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.imageRect = e.target.result;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };
    });
});