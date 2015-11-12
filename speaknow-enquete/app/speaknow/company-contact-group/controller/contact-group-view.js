define([
    'connecta.speaknow',
    'speaknow/company-contact-group/service/contact-group-service',
    'speaknow/company-contact/service/company-contact-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ContactGroupViewController',
            function ($scope, ContactGroupService, CompanyContactService,
                    $routeParams, $location, ngTableParams, notify) {

                $scope.contactGroup = {};

                if ($routeParams.id) {
                    ContactGroupService.get($routeParams.id).success(function (data) {
                        $scope.contactGroup = data;
                        CompanyContactService.setContactGroup($scope.contactGroup);
                    });
                } else {
                    $location.path('speaknow/company');
                }

                ContactGroupService.readOnly($routeParams.id).then(function (response) {
                    $scope.readOnly = response.data;
                });

                $scope.tableParams = new ngTableParams({
                    count: 10,
                    page: 1,
                    filter: $scope.search
                }, {
                    getData: function ($defer, params) {
                        var data = $scope.contactGroup.contacts;
                        if (data !== undefined) {
                            params.total(data.length);
                            return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        } else {
                            return 0;
                        }
                    },
                    counts: [10, 30, 50, 100]
                });

                $scope.delete = function (id) {
                    ContactGroupService.delete(id).success(function () {
                        notify.success('COMPANYGROUP.REMOVE_SUCCESS');
                        $location.path('speaknow/company/view');
                    });
                };

                $scope.deleteContact = function (id) {
                    CompanyContactService.delete(id).success(function () {
                        notify.success('COMPANY_CONTACT.REMOVE_SUCCESS');
                        ContactGroupService.get($routeParams.id).success(function (data) {
                            $scope.contactGroup = data;
                            CompanyContactService.setContactGroup($scope.contactGroup);
                            $scope.tableParams.reload();
                        });
                    });
                };

                $scope.modalParams = {
                    title: 'Exclusão de grupo de contatos',
                    text: 'Deseja realmente excluir este grupo?',
                    size: 'sm',
                    success: $scope.delete
                };

                $scope.modalRemoveContacts = {
                    title: 'Exclusão de contatos',
                    text: 'Deseja realmente excluir este contato?',
                    size: 'sm',
                    success: $scope.deleteContact
                };
            });
});