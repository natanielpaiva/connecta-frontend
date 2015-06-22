define([
    'connecta.speaknow',
    'speaknow/company-contact-group/service/contact-group-service',
    'speaknow/company-contact/service/company-contact-service',
    'portal/layout/service/notify'
], function(speaknow){
    return speaknow.lazy.controller('ContactGroupViewController', 
        function($scope, ContactGroupService, CompanyContactService, $routeParams, $location, ngTableParams, $translate, notify){
        
        $scope.contactGroup = {};
        
        if ($routeParams.id) {
            ContactGroupService.get($routeParams.id).success(function(data){
                $scope.contactGroup = data;
                CompanyContactService.setContactGroup($scope.contactGroup);
            });
        } else {
            $location.path('speaknow/company');
        }
        
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                var data = $scope.contactGroup.contacts;
                if(data !== undefined){
                    params.total(data.length);
                    return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                } else {
                    return 0;
                }
            },
            counts: [20, 50, 100]
        });
        
        $scope.delete = function (id) {
            ContactGroupService.delete(id).success(function () {
                $translate('COMPANY_CONTACT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('speaknow/company/' + $scope.contactGroup.company.id);
                });
            });
        };
        
        $scope.deleteContact = function (id) {
            CompanyContactService.delete(id).success(function () {
                $translate('COMPANY_CONTACT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
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