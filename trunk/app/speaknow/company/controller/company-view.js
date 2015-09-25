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
                $scope.currentyDate = new Date().getTime();

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
                    $scope.company.companyContacts = $scope.company.companyContacts.sort(function(a, b){
                        if(a > b){
                            return -1;
                        } else if(a > b){
                            return 1;
                        }
                        
                        return 0;
                    });
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
                            var companyContacts = $scope.company.companyContacts;
                            for(var i in companyContacts){
                                if(companyContacts[i].main){
                                    var other = angular.copy(companyContacts[0]);
                                    var main = angular.copy(companyContacts[i]);
                                    companyContacts[0] = main;
                                    companyContacts[i] = other;
                                }
                            }
                            var data = companyContacts;
                            params.total(data.length);
                            return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        },
                        counts: [10, 30, 50, 100]
                    });
                };

                $scope.delete = function (id) {
                    CompanyService.delete(id).success(function () {
                        notify.success('COMPANY.REMOVE_SUCCESS');
                        $location.path('speaknow/company/new');
                    });
                };

                $scope.deleteContactGroup = function (id) {
                    ContactGroupService.delete(id).success(function () {
                        notify.success('COMPANY.REMOVE_GROUP_SUCCESS');
                        CompanyService.get($scope.company.id).success(function (data) {
                            $scope.company = data;
                            ContactGroupService.setCompany($scope.company);
                            $scope.tableParams.reload();
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