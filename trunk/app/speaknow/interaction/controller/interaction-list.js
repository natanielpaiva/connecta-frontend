define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionListController', function (
            $scope, InteractionService, ngTableParams, notify, sortBy,
            CompanyService, $location, speaknowResources) {

        $scope.baseUrl = speaknowResources.base;

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }

            notify.warning('INTERACTION.WITHOUT_COMPANY');
            $location.path('speaknow/company/new');
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
                        notify.warning('INTERACTION.SEARCH_EMPTY');
                    }
                });
            },
            counts: [10, 30, 50, 100]
        });

        //TODO caixa de dialogo de confirmação do delete
        $scope.delete = function (id) {
            InteractionService.delete(id).success(function () {
                notify.success("INTERACTION.DELETED");
                $scope.tableParams.reload();
            });
        };

        $scope.modalParams = {
            title: 'Exclusão de Interações',
            text: 'Deseja realmente excluir esta interação?',
            size: 'sm',
            success: $scope.delete
        };

        $scope.getImage = function (interaction) {
            return $scope.baseUrl + interaction.image + '?_=' + new Date().getTime();
        };
    });
});