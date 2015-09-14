define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionListController', function (
            $scope, InteractionService, ngTableParams, notify, $translate, sortBy,
            CompanyService, $location, speaknowResources
            ) {

        $scope.baseUrl = speaknowResources.base;

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }

            $translate('INTERACTION.WITHOUT_COMPANY').then(function (text) {
                notify.warning(text);
                $location.path('speaknow/company/new');
            });
        });

        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return InteractionService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data.content, "name");
                    $defer.resolve(result);
                    var key = "filter[name]";
                    if (response.config.params[key] &&
                            response.data.content.length === 0) {
                        $translate('INTERACTION.SEARCH_EMPTY').then(function (text) {
                            notify.success(text);
                        });
                    }
                });
            },
            counts: [10, 30, 50, 100]
        });

        //TODO caixa de dialogo de confirmação do delete
        $scope.delete = function (id) {
            InteractionService.delete(id).success(function () {
                notify.success("interaçao Deletada com sucesso!");
                $scope.tableParams.reload();
            });
        };

        $scope.modalParams = {
            title: 'Exclusão de Interações',
            text: 'Deseja realmente excluir esta interaçao?',
            size: 'sm',
            success: $scope.delete
        };

        $scope.getImage = function (interaction) {
            return $scope.baseUrl + interaction.image + '?_=' + new Date().getTime();
        };
    });
});
