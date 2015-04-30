define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/action/service/action-service',
    'speaknow/action/controller/action-modal'
], function (speaknow) {
    /**
     * //TODO
     * Criar diretiva para modal para o portal, e para modal de icones do speaknow
     */
    return speaknow.lazy.controller('InteractionFormController', function ($scope,
            InteractionService, ActionService, speaknowResources, $location, $routeParams, $translate,
            $modal) {

        $scope.interaction = {
            icon: "dump"
        };

        $translate('INTERACTION.DROP_FILE_HERE').then(function (text) {
            $scope.interactionImg = text;
        });

        // Recupera os tipo de interações disponíveis (enum InteractionType)
        $scope.interactionTypes = [];
        ActionService.getActionTypes().then(function (response) {
            $scope.interactionTypes = response.data;
            $scope.interaction.type = $scope.interactionTypes[0];
        });

        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            InteractionService.get($routeParams.id).success(function (data) {
                $scope.interaction = data;
                $scope.interactionImage = "data:image/jpeg;base64," + $scope.interaction.image;
            });
        }

        $scope.icons = [];
        //Recupera a lista de icones do selection.json
        ActionService.getIcons().success(function (data) {
            $scope.icons = data.icons.slice(0, 100);
        });

        // Executa a modal para escolha de ícones
        $scope.openIconModal = function () {
            var modalIcon = $modal.open({
                templateUrl: 'app/speaknow/action/template/modal.html',
                controller: 'ActionFormModalController',
                windowClass: 'connecta-modal',
                resolve: {
                    items: function () {
                        return $scope.icons;
                    },
                    selected: function () {
                        return $scope.interaction.icon;
                    }
                }
            });

            modalIcon.result.then(function (selectedItem) {
                $scope.interaction.icon = selectedItem;
            });
        };

        //TODO: Implementar regras de upload de arquivo
        $scope.onFileSelected = function (files) {
            var file = files[0];
            if (file) {
                $scope.imgName = file.name;
                var reader = new FileReader();
                reader.onload = function (e) {
                    $scope.interaction.image = e.target.result.replace(new RegExp(speaknowResources.regexBase64), "");
                    $scope.interactionImage = "data:image/jpeg;base64," + $scope.interaction.image;
                    $scope.$apply();
                };
                reader.readAsDataURL(files[0]);
            }
        };

        $scope.nextStep = function () {
            ActionService.setInteraction($scope.interaction);
            $location.path('speaknow/action/new');
        };
        
        $scope.save = function () {
            InteractionService.save($scope.interaction).success(function () {
                console.info("Interaction Salva com sucesso!");
                $location.path('speaknow/interaction');
            });
        };

    });
});