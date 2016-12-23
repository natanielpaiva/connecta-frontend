define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ContactListController', function ($scope, 
        ContactService, CompanyService, notify,  $location, ngTableParams, sortBy) {

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }
            notify.warning('CONTACT.WITHOUT_COMPANY');
            $location.path('speaknow/company/new');
        });

        $scope.contacts = null;
        $scope.search = {
            name: ''
        };
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ContactService.list(params.url()).then(function (response) {
                    if (response.data.content.length === 0 && $scope.search.name.length > 0) {
                        notify.warning('LAYOUT.NO_RESULTS');
                    }
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data.content, "name");
                    $defer.resolve(result);
                });
            },
            counts: [10, 30, 50, 100]
        });

        $scope.delete = function (id) {
            ContactService.delete(id).success(function () {
                notify.success('CONTACT.REMOVE_SUCCESS');
                $scope.tableParams.reload();
            });
        };

        $scope.modalParams = {
            title: 'Exclusão de contato',
            text: 'Deseja realmente excluir este contato?',
            size: 'sm',
            success: $scope.delete
        };
    });
});
