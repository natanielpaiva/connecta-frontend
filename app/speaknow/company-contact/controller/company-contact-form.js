define([
    'connecta.speaknow',
    'speaknow/company-contact/service/company-contact-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyContactFormController',
            function ($scope, CompanyContactService, notify, $routeParams, $location, $translate, ngTableParams) {

                $scope.contactGroup = CompanyContactService.getContactGroup();
                $scope.companyContact = {contactGroup: $scope.contactGroup};
                $scope.isPhone = false;
                $scope.isEmail = false;

                $scope.createInputValue = function () {
                    if ($scope.companyContact.type == "PHONE") {
                        $scope.isPhone = true;
                    } else {
                        $scope.isPhone = false;
                    }
                };

                if ($routeParams.id) {
                    CompanyContactService.get($routeParams.id).success(function (data) {
                        $scope.isEdit = true;
                        $scope.companyContact = data;
                        $scope.createInputValue();
                    });
                }

                $scope.submit = function () {
                    if ($scope.companyContact.type == "PHONE") {
                        $scope.companyContact.value = $scope.phone;
                    } else {
                        $scope.companyContact.value = $scope.email;
                    }
                    CompanyContactService.save($scope.companyContact).then(function () {
                        $translate('COMPANY.SUCCESS').then(function (text) {
                            notify.success(text);
                            $location.path('speaknow/company/contact/group/' + $scope.contactGroup.id);
                        });
                    });
                };

            });
});