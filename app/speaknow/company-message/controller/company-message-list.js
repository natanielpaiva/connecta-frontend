define([
    'connecta.speaknow',
    'speaknow/company-message/service/company-message-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyMessageListController',
            function ($scope, CompanyMessageService, ngTableParams, notify, CompanyService, $location) {

                CompanyService.getUserCompany().then(function (response) {
                }, function (data) {
                    notify.warning('COMPANY_MESSAGE.WITHOUT_COMPANY');
                    $location.path('speaknow/company/new');
                });

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
                            if (response.data.content.length === 0 && $scope.search.name.length > 0) {
                                notify.warning('COMPANY_MESSAGE.NO_RESULT');
                            }
                            params.total(response.data.totalElements);
                            $defer.resolve(response.data.content);
                        });
                    },
                    counts: [10, 30, 50, 100]
                });


                $scope.delete = function (id) {
                    CompanyMessageService.delete(id).success(function () {
                        notify.success('COMPANY_MESSAGE.REMOVE_SUCCESS');
                        $scope.tableParams.reload();
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
