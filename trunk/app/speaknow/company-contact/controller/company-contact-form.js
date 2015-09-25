define([
    'connecta.speaknow',
    'speaknow/company-contact/service/company-contact-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyContactFormController',
            function ($scope, CompanyContactService, notify, $routeParams, $location) {

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
                        if ($scope.companyContact.type == "PHONE") {
                            $scope.phone = $scope.companyContact.value;
                        } else {
                            $scope.email = $scope.companyContact.value;
                        }
                    });
                }

                $scope.submit = function () {
                    if ($scope.companyContact.type == "PHONE") {
                        $scope.companyContact.value = $scope.phone;
                    } else {
                        $scope.companyContact.value = $scope.email;
                    }
                    CompanyContactService.save($scope.companyContact).then(function () {
                        notify.success('COMPANY.SUCCESS');
                        $location.path('speaknow/company/contact/group/' + $scope.contactGroup.id);
                    });
                };

            });
});