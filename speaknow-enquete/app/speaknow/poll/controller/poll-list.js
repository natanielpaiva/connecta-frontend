define([
    'connecta.speaknow',
    'speaknow/poll/service/poll-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('PollListController', function (
            $scope, PollService, ngTableParams, notify, sortBy, $location, speaknowResources) {

        $scope.baseUrl = speaknowResources.base;

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return PollService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data, "name");
                    $defer.resolve(result);
                   /// var key = "filter['name]";
                    //if (response.config.params[key] &&
                    //    response.data.content.length === 0) {
                    //    notify.warning('INTERACTION.SEARCH_EMPTY');
                    //}
                });
            },
            counts: [5, 10, 15, 20]
        });

        //TODO caixa de dialogo de confirmação do delete
        $scope.delete = function (id) {
            PollService.delete(id).success(function () {
                notify.success("POLL.DELETED");
                $scope.tableParams.reload();
            });
        };

        $scope.modalParams = {
            title: 'Exclusão de Interações',
            text: 'Deseja realmente excluir esta interação?',
            size: 'sm',
            success: $scope.delete
        };

        $scope.toggleActiveStatus = function(poll){
            if(poll.active){
                PollService.deactivate(poll.id);
            }else{
                PollService.activate(poll.id);
            }
        };
    });
});
