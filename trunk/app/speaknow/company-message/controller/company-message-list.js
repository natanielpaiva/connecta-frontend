define([
    'connecta.speaknow',
    'speaknow/company-message/service/company-message-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyMessageListController',
            function ($scope, CompanyMessageService, ngTableParams, notify, $translate) {

                $scope.messages = null;
                $scope.search = {
                    subject: ''
                };
                $scope.tableParams = new ngTableParams({
                    count: 10,
                    page: 1,
                    filter: $scope.search
                }, {
                    getData: function ($defer, params) {
                        return CompanyMessageService.list(params.url()).then(function (response) {
                            params.total(response.data.totalElements);
                            $defer.resolve(response.data.content);
                        });
                    },
                    counts: [10, 30, 50, 100]
                });


                $scope.delete = function (id) {
                    CompanyMessageService.delete(id).success(function () {
                        $translate('COMPANY_MESSAGE.REMOVE_SUCCESS').then(function (text) {
                            notify.success(text);
                            $scope.tableParams.reload();
                        });
                    });
                };

                $scope.modalParams = {
                    title: 'Exclusão de Mensagem',
                    text: 'Deseja realmente excluir esta mensagem?',
                    size: 'sm',
                    success: $scope.delete
                };
            });
});
