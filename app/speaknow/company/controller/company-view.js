define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'speaknow/company-contact-group/service/contact-group-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyViewController',
            function ($scope, CompanyService, ContactGroupService, $routeParams, $location, ngTableParams, $translate,
                    speaknowResources, notify) {

                $scope.company = {};
                $scope.baseUrl = speaknowResources.base;

//                if ($routeParams.id) {
//                    CompanyService.get($routeParams.id).then(function (data) {
//                        $scope.company = data;
//                        $scope.getGroups();
//                        ContactGroupService.setCompany($scope.company);
//                    }, function(data){
//                        $location.path('speaknow/company');
//                    });
//                } else {
//                }
                CompanyService.getUserCompany().then(function (response) {
                    $scope.company = response.data;
                    $scope.getGroups();
                    ContactGroupService.setCompany($scope.company);
                }, function (data) {
                    $location.path('speaknow/company/new');
                });

                $scope.getGroups = function () {
                    $scope.tableParams = new ngTableParams({
                        count: 10,
                        page: 1,
                        filter: $scope.search
                    }, {
                        getData: function ($defer, params) {
                            var data = $scope.company.companyContacts;
                            params.total(data.length);
                            return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        },
                        counts: [20, 50, 100]
                    });
                };

                $scope.delete = function (id) {
                    CompanyService.delete(id).success(function () {
                        $translate('COMPANY.REMOVE_SUCCESS').then(function (text) {
                            notify.success(text);
                            $location.path('speaknow/company/new');
                        });
                    });
                };

                $scope.deleteContactGroup = function (id) {
                    ContactGroupService.delete(id).success(function () {
                        $translate('COMPANY_CONTACT.REMOVE_SUCCESS').then(function (text) {
                            notify.success(text);
                            CompanyService.get($routeParams.id).success(function (data) {
                                $scope.company = data;
                                ContactGroupService.setCompany($scope.company);
                                $scope.tableParams.reload();
                            });
                        });
                    });
                };

                $scope.modalRemoveContactGroup = {
                    title: 'Exclusão de grupo de contatos',
                    text: 'Deseja realmente excluir este grupo?',
                    size: 'sm',
                    success: $scope.deleteContactGroup
                };

                $scope.modalParams = {
                    title: 'Exclusão de Empresa',
                    text: 'Deseja realmente excluir esta empresa?',
                    size: 'sm',
                    success: $scope.delete
                };
            });
});