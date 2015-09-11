define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/action/service/action-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionViewController', function (
            $scope, InteractionService, speaknowResources, ActionService, $routeParams, $location, ngTableParams,
            $translate, notify
            ) {

        $scope.baseUrl = speaknowResources.base;

        var redirectToInteraction = function () {
            $location.path('speaknow/interaction');
        };

        if ($routeParams.id) {
            InteractionService.get($routeParams.id).then(function (response) {
                $scope.interaction = response.data;
            }, function (response) {
                redirectToInteraction();
            });
        } else {
            console.error("Id da interaction não informado na url");
            redirectToInteraction();
        }

        //TODO Vai ter search na view da Interaction pras actions?
        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 20,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                var data = $scope.interaction.actions;
                params.total(data.length);
                return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            },
            counts: [20, 50, 100]
        });

        $scope.deleteInteraction = function (id) {
            InteractionService.delete(id).success(function () {
                redirectToInteraction();
            });
        };

        $scope.editInteraction = function (id) {
            $location.path('speaknow/interaction/' + id);
        };

        $scope.redirectToAction = function (id) {
            ActionService.setInteraction($scope.interaction);

            if (!id) {
                return '#/speaknow/action/new';
            } else {
                return '#/speaknow/action/' + id + '/edit';
            }

        };

        $scope.sendMessage = function (id) {
            ActionService.sendMessage(id).then(function (response) {
                notify.success("Mensagem enviada com sucesso!");
            });
        };

        $scope.delete = function (id) {
            ActionService.delete(id).success(function () {
                notify.success('INTERACTION.REMOVE_ACTION_SUCCESS');
                InteractionService.get($routeParams.id).success(function (data) {
                    $scope.interaction = data;
                    $scope.tableParams.reload();
                });
            });
        };

        $scope.updateDefault = function (id) {
            ActionService.setDefault(id).success(function () {
                notify.success("INTERACTION.ACTION_DEFAULT_SUCCESS");
                InteractionService.get($routeParams.id).success(function (data) {
                    $scope.interaction = data;
                    $scope.tableParams.reload();
                });
            });
        };

        $scope.modalSetDefault = {
            title: 'Status da Ação',
            text: 'Deseja marcar a Ação como padrão?',
            size: 'sm',
            success: $scope.updateDefault
        };

        $scope.modalSendWhats = {
            title: 'Enviar Whatsapp',
            text: 'Deseja realmente enviar a enquete?',
            size: 'sm',
            success: $scope.sendMessage
        };

        $scope.modalRemoveAction = {
            title: 'Excluir Ação',
            text: 'Deseja realmente remover a ação?',
            size: 'sm',
            success: $scope.delete
        };

        $scope.modalRemoveInteraction = {
            title: 'Exclusão de Interações',
            text: 'Deseja realmente excluir esta interaçao?',
            size: 'sm',
            success: $scope.deleteInteraction
        };

    });
});
