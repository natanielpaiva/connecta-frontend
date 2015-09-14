define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ContactListController', function ($scope, ContactService, CompanyService, notify,  $location, ngTableParams, $translate, sortBy) {


        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }
            $translate('CONTACT.WITHOUT_COMPANY').then(function (text) {
                notify.warning(text);
                $location.path('speaknow/company/new');
            });
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
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data.content, "name");
                    $defer.resolve(result);
                });
            },
            counts: [10, 30, 50, 100]
        });

        $scope.delete = function (id) {
            ContactService.delete(id).success(function () {
                $translate('CONTACT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $scope.tableParams.reload();
                });
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
