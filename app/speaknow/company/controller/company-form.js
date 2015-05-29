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
            if($scope.fileRect === undefined){
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

        $scope.fileRectDropped = function (files) {
            if (files && files.length) {
                $scope.fileRect = files[0];
                var reader = new FileReader();
                reader.onload = function (e) {
                    if($scope.validateImage(e)){
                        $scope.imageRect = e.target.result;
                        $scope.$apply();
                    } else {
                        $scope.imageRect = null;
                        $scope.fileRect = null;
                    }
                };
                reader.readAsDataURL(files[0]);
            }
        };
        
        $scope.validateImage = function(image){
            var isValid = true;
            if(image.total / 1000000 > 1){
                notify.warning("COMPANY.VALIDATION.IMAGESIZE");
                isValid = false;
            } else {
                var img = angular.element("<img>")[0];
                img.src = image.target.result;
                if(img.height >= img.width){
                    notify.warning("COMPANY.VALIDATION.IMAGEFORM");
                    isValid = false;
                }
            }
            return isValid;
        };
    });
});