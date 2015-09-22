define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/action/service/action-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('InteractionViewController', function (
            $scope, InteractionService, speaknowResources, ActionService, 
            $routeParams, $location, ngTableParams, notify) {

        $scope.baseUrl = speaknowResources.base;
            
        var redirectToInteraction = function () {
            $location.path('speaknow/interaction');
        };

        if (!$routeParams.id) {
            console.error("Id da interaction não informado na url");
            redirectToInteraction();
        }
        
        InteractionService.readOnly($routeParams.id).then(function(response){
            $scope.readOnly = response.data;
        });

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
                InteractionService.get($routeParams.id).then(function (response) {
                    $scope.interaction = response.data;
                    var data = $scope.interaction.actions;
                    params.total(data.length);
                    return $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }, function (error) {
                  if(error.status === 403){
                    notify.warning("INTERACTION.VIEW_FORBIDDEN");
                  }

                  redirectToInteraction();
                });
            },
            counts: [20, 50, 100]
        });

        $scope.deleteInteraction = function (id) {
            InteractionService.delete(id).success(function () {
                redirectToInteraction();
            });
        };

        $scope.editInteraction = function (id) {
            ActionService.containsAnswer(id).then(function (response) {
                if (response.data) {
                    notify.warning("ACTION.CONTAINS_ANSWER");
                    return;
                }
                ActionService.setInteraction($scope.interaction);
                $location.path('speaknow/action/' + id + '/edit');
            });
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
                notify.success("INTERACTION.MESSAGE_SUCCESS");
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
            text: 'Deseja realmente excluir a ação?',
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
