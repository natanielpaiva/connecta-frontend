define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyFormController',
            function ($scope, CompanyService, notify, speaknowResources, $location, $routeParams) {

        $scope.baseUrl = speaknowResources.base;
        $scope.addressValid = true;
        $scope.company = {
            'companyContacts':[]
        };
        $scope.companyContacts = {
            'main':true,
            'contacts':[]
        };

        if ($routeParams.id) {
            $scope.isEditing = true;
            CompanyService.get($routeParams.id).success(function (data) {
                $scope.company = data;
                for(var i in $scope.company.companyContacts){
                    if($scope.company.companyContacts[i].main){
                        $scope.phone = $scope.company.companyContacts[i].contacts[0].value;
                        $scope.email = $scope.company.companyContacts[i].contacts[1].value;
                    }
                }
            });
        } else {
            CompanyService.getUserCompany().success(function (response) {
                $location.path('speaknow/company/view');
                notify.success('COMPANY.EXITST');
            });
        }

        $scope.getImgRectUrl = function (){
          return $scope.baseUrl + $scope.company.imageRect + '?_=' + new Date().getTime();
        };

        $scope.submit = function () {
            if($scope.validateForm()){
                $scope.save();
            }
        };

        $scope.save = function () {
            CompanyService.save($scope.fileQuad, $scope.fileRect, $scope.company).then(function (response) {
              notify.success('COMPANY.SUCCESS');
              $location.path('speaknow/company/view');
            });
        };

        $scope.updateContacts = function(){
            for(var index in $scope.company.companyContacts[0].contacts){
                if($scope.company.companyContacts[0].contacts[index].type == "PHONE"){
                    $scope.company.companyContacts[0].contacts[index].value = $scope.phone;
                } else {
                    $scope.company.companyContacts[0].contacts[index].value = $scope.email;
                }
            }
        };

        $scope.registerContacts = function(){
            $scope.company.companyContacts = [];
            $scope.companyContacts.contacts = [];

            var contactPhone = {
                'name': "Phone",
                'type': 0,
                'value': $scope.phone
            };

            var contactEmail = {
                'name': "Email",
                'type': 1,
                'value': $scope.email
            };

            $scope.companyContacts.name = $scope.company.name;
            $scope.companyContacts.description = "Grupo de Contatos Padrão";
            $scope.companyContacts.contacts.push(contactPhone);
            $scope.companyContacts.contacts.push(contactEmail);
            $scope.company.companyContacts.push($scope.companyContacts);
        };

        $scope.fileRectDropped = function (files, ev, rejFiles) {
            if (rejFiles && rejFiles.length) {
                notify.warning('COMPANY.VALIDATION.INVALID_DOCUMENT');
                return;
            }

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

        $scope.validateForm = function(){
            var isValid = true;
            if($scope.fileRect === undefined && !$scope.isEditing){
                $scope.rectInvalid = true;
                isValid = false;
            } else {
                if($scope.isEditing){
                    $scope.updateContacts();
                } else {
                    $scope.registerContacts();
                }
            }
            return isValid;
        };

        $scope.validateAddress = function () {
            CompanyService.getLatLong($scope.company.address).then(function (result) {
                if (result.data.status === "OK") {
                    $scope.addressValid = true;
                    $scope.company.lat = result.data.results[0].geometry.location.lat;
                    $scope.company.lng = result.data.results[0].geometry.location.lng;
                } else {
                    $scope.addressValid = false;
                }
            });
        };
    });
});