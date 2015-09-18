define([
    'connecta.speaknow',
    'speaknow/interaction/service/interaction-service',
    'speaknow/action/service/action-service',
    'speaknow/action/controller/action-modal',
    'portal/layout/service/notify'
], function (speaknow) {
    /**
     * //TODO
     * Criar diretiva para modal para o portal, e para modal de icones do speaknow
     */
    return speaknow.lazy.controller('InteractionFormController', function ($scope,
            InteractionService, ActionService, regexBase64, $location, $routeParams, $translate,
            $modal, speaknowResources, notify) {


        $scope.imageFile = [];
        $scope.imageUrl = [];
        $scope.interaction = {
            icon: "dump"
        };
        $scope.baseUrl = speaknowResources.base;

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
                if ($scope.interaction.image) {
                    $scope.interactionImage = $scope.baseUrl + $scope.interaction.image;
                    $scope.imageUrl.push({image : $scope.interactionImage, extension: "PNG"});
                }
            });
        }

        $scope.icons = [];
        //Recupera a lista de icones do selection.json
        ActionService.getIcons().success(function (data) {
            $scope.icons = data.icons;
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

        $scope.onFileSelected = function (files) {
            if (files && files.length) {
                var file = files[0];
                $scope.fileImage = file;
                $scope.imgName = file.name;
                var reader = new FileReader();
                reader.onload = function (e) {
                    if ($scope.validateImage(e)) {
                        $scope.interactionImage = e.target.result;
                        $scope.$apply();
                    } else {
                        $scope.interactionImage = null;
                    }
                };
                reader.readAsDataURL(files[0]);
            } else {
                $translate('INTERACTION.INVALID_DOCUMENT').then(function (text) {
                    notify.warning(text);
                });
            }
        };

        var validateForm = function () {
            $scope.interaction_form.$submitted = true;
            if ($scope.interactionImage === null) {
                $scope.imageInvalid = true;
                return false;
            } else {
                $scope.imageInvalid = false;
            }
            return $scope.interaction_form.$valid;
        };

        $scope.nextStep = function () {
            if (!validateForm()) {
                return;
            }
            $scope.interaction.image = $scope.fileImage;
            ActionService.setInteraction($scope.interaction);
            $location.path('speaknow/action/new');
        };

        $scope.save = function () {
            InteractionService.save($scope.interaction, $scope.fileImage).success(function () {
                $translate('INTERACTION.SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('speaknow/interaction');
                });
            });
        };

        $scope.validateImage = function (image) {
            var isValid = true;
            if (image.size / 1000000 > 1) {
                notify.warning("COMPANY.VALIDATION.IMAGESIZE");
                $scope.clearImage();
                isValid = false;
            } else {
                var img = angular.element("<img>")[0];
                img.src = $scope.interactionImage;
                if (img.height >= img.width) {
                    notify.warning("COMPANY.VALIDATION.IMAGEFORM");
                    $scope.clearImage();
                    isValid = false;
                }
            }
            return isValid;
        };
        
        $scope.dropImageCallback = function(){
            $scope.fileImage = $scope.imageFile[0];
            $scope.interactionImage = $scope.imageUrl[0].image;
            $scope.validateImage($scope.imageFile[0]);
        };
        
        $scope.clearImage = function(){
            $scope.interactionImage = null;
            $scope.fileImage = null;
            $scope.imageFile = [];
            $scope.imageUrl = [];
        };
        
    });
});