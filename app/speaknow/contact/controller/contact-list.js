define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ContactListController', function ($scope, ContactService, notify, ngTableParams, $translate) {

        $scope.contacts = null;

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ContactService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
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
