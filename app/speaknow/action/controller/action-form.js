define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'speaknow/interaction/service/interaction-service',
    'speaknow/whatsapp/service/whatsapp-service',
    'speaknow/action/controller/action-modal',
    'portal/layout/service/notify'
], function (speaknow) {
    /* //TODO
     * validar formulario
     * regras de uplaod de arquivo
     */
    return speaknow.lazy.controller('ActionFormController', function ($scope,
            InteractionService, ActionService, WhatsappService, notify, $location, $routeParams, $modal, $translate, $rootScope) {

        $scope.interaction = ActionService.getInteraction();
        $scope.contact = null;
        $scope.contacts = [];
        $scope.allContacts = true;

        var param = {
            type: "TEXT",
            options: [],
            max: true
        };

        var section = {
            params: [angular.copy(param)],
            max: true
        };

        $scope.action = {
            sections: [angular.copy(section)],
            icon: "dump"
        };

        if ($scope.interaction) {
            $scope.action.interaction = $scope.interaction;
        } else {
            $location.path('/speaknow/interaction');
            console.error('Interaction não informada');
        }

        $translate('ACTION.SECTION.TITLE').then(function (value) {
            $scope.newSectionStr = value;
        });

        $translate('ACTION.SECTION.PARAM.TITLE').then(function (value) {
            $scope.newParamStr = value;
        });

        $scope.getContacts = function (val) {
            if (val.length > 3) {
                return ActionService.getContacts(val);
            }
        };

        $scope.addContact = function () {
            $scope.contacts.push($scope.contact);
            $scope.contact = null;
        };

        $scope.removeContact = function (contact) {
            var index = $scope.contacts.indexOf(contact);
            $scope.contacts.splice(index, 1);
        };

        $scope.addParam = function (section) {
            $scope.minifyCard(section.params);
            section.params.push(angular.copy(param));
            $scope.verifyAnswerAndQuestionSeparator();
        };

        $scope.removeParam = function (section, param) {
            section.params.splice(section.params.indexOf(param), 1);
            $scope.verifyAnswerAndQuestionSeparator();
        };

        $scope.finishParam = function (sec_index, index, param) {
            if (!$scope.validateParam(sec_index, index, param)) {
                return;
            }

            param.max = false;
        };

        $scope.onChangeParamType = function (type) {
            $scope.showParamOpts = $scope.isMultiple(type);
            $scope.verifyAnswerAndQuestionSeparator();
        };
        
        $scope.verifyAnswerAndQuestionSeparator = function(){
            for(var index in $scope.action.sections){
                var section = $scope.action.sections[index];
                if (section.params.length > 1) {
                    $scope.isQuestionSeparator = true;
                } else {
                    $scope.isQuestionSeparator = false;
                }
                
                $scope.isAnswerSeparator = false;
                for(var i in section.params){
                    var param = section.params[i];
                    if(param.type != "SELECT" && $scope.isMultiple(param.type)){
                        $scope.isAnswerSeparator = true;
                    }
                }
            }
        };

        $scope.addSection = function () {
            var sections = $scope.action.sections;
            $scope.minifyCard(sections);
            sections.push(angular.copy(section));
        };

        $scope.removeSection = function (section) {
            var sections = $scope.action.sections;
            sections.splice(sections.indexOf(section), 1);
        };

        $scope.minifyCard = function (itemArr) {
            itemArr.forEach(function (item) {
                item.max = false;
            });
        };

        $scope.icons = [];
        //Recupera a lista de icones do selection.json
        ActionService.getIcons().success(function (data) {
            $scope.icons = data.icons;
        });

        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            ActionService.get($routeParams.id).success(function (data) {
                $scope.action = data;
                
                ActionService.containsAnswer($scope.action.id).then(function (response) {
                    if (response.data) {
                        notify.warning("ACTION.CONTAINS_ANSWER");
                        $location.path('speaknow/interaction/' + $scope.action.interaction.id);
                        return;
                    }
                });
                
                $scope.isWhatsapp = $scope.action.whatsappAccount !== undefined;
                if ($scope.action.contacts.length > 0) {
                    $scope.allContacts = false;
                    $scope.whatsappAccount = $scope.action.whatsappAccount;
                    $scope.contacts = $scope.action.contacts;
                }
            });
        }

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
                        return $scope.action.icon;
                    }
                }
            });

            modalIcon.result.then(function (selectedItem) {
                $scope.action.icon = selectedItem;
            });
        };

        // Recupera os tipo de interações disponíveis (enum InteractionType)
        $scope.actionTypes = [];
        ActionService.getActionTypes().then(function (response) {
            $scope.actionTypes = response.data;
            $scope.action.type = response.data[0];
        });

        WhatsappService.listActive().then(function (response) {
            $scope.whatsappAccounts = response.data.content;
        });

        // Recupera os tipos de parametros (enum InteractionParameterType)
        $scope.paramTypes = [];
        $scope.getParamTypes = function () {
            ActionService.getParamTypes().then(function (response) {
                $scope.paramTypes = response.data;
            });
        };

        $scope.verifyType = function () {
            if ($scope.action.type == 'SERVICE') {
                $scope.isWhatsapp = false;
            } else if($scope.action.type == 'FAQ'){
                
            }
        };

        $scope.setParamTypesWhatsApp = function () {
            $scope.paramTypes = ["MULTI_SELECT", "SELECT", "TEXT"];
        };

        $scope.setParameterType = function () {
            if ($scope.isWhatsapp) {
                $scope.setParamTypesWhatsApp();
            } else {
                $scope.getParamTypes();
            }
        };

        $scope.getParamTypes();

        $scope.submit = function () {
            //Verifica se esta action possui Whatsapp
            if ($scope.isWhatsapp) {
                if(!$scope.validateWhatsapp()){
                    return;
                }
            }

            if (!$scope.validateSections()) {
                return;
            }
            if (!$scope.interaction.id) {
                $scope.interaction.actions = [];

                var image = $scope.interaction.image;

                delete $scope.interaction.image;
                delete $scope.action.interaction;

                $scope.interaction.actions.push($scope.action);
                InteractionService.save($scope.interaction, image).success(function (response) {
                    ActionService.clearInteraction();
                    notify.success('INTERACTION.SUCCESS');
                    $location.path('/speaknow/interaction/' + response.id);
                });
            } else {
                $scope.action.interaction = $scope.interaction;
                ActionService.save($scope.action).success(function (response) {
                    ActionService.clearInteraction();
                    notify.success('ACTION.SUCCESS');
                    $location.path('/speaknow/interaction/' + $scope.action.interaction.id);
                });
            }
        };

        $scope.validateWhatsapp = function(){
            if ($scope.contacts.length > 0) {
                    $scope.action.contacts = $scope.contacts;
                } else if (!$scope.allContacts) {
                    notify.error('ACTION.CONTACTS_NULL');
                    return false;
                }
                $scope.action.whatsappAccount = angular.fromJson($scope.whatsappAccount);
                $scope.action.messageWhatsapp = $scope.createWhatsappMessage($scope.action);

                if ($scope.action.messageWhatsapp.length > 500) {
                    if(!$scope.saveWithoutSend){
                        $scope.openModalWhatsAppMessage();
                        return false;
                    }
                }
                
                return true;
        };

        /** Validations */

        /**
         * Método para validar cada parametro individualmente
         * utilizado no ng-repeat dos parametros de cada Section
         * @param  {number} index - Index do parametro dentro da section
         * @param  {Object} param - O parametro da section do escoppo
         * @return {Boolean} rue -> valid e False -> invalid
         */
        $scope.validateParam = function (sec_index, index, param) {
            var form = $scope.actionForm;
            var title = form['section' + sec_index + '_param_title_' + index];

            if (!title)
                return;

            title = form['section' + sec_index + '_param_title_' + index].$valid;
            var name = $scope.isServiceAction() ? form['section' + sec_index + '_param_name_' + index].$valid : true;
            var options = $scope.isMultiple(param.type) ? (param.options.length && $scope.validateParamOptions(param.options)) : true;

            return title && name && options;
        };

        $scope.validateParams = function (index, section) {

            function checkParams() {
                for (var i in section.params) {
                    var param = section.params[i];
                    if (!$scope.validateParam(index, i, param)) {
                        return false;
                    }
                }
                return true;
            }

            return section.params.length && checkParams();

        };

        $scope.validateParamOptions = function (options) {
            function verifyEmpty(option) {
                return (
                        (!option.value || angular.equals("", option.value)) ||
                        (!option.key || angular.equals("", option.key))
                        );
            }

            for (var i in options) {
                var option = options[i];
                if (angular.equals({}, option) || verifyEmpty(option)) {
                    return false;
                }
            }

            return true;
        };

        $scope.validateSections = function () {
            var sections = $scope.action.sections;
            for (var i in sections) {
                var section = sections[i];
                if (!$scope.validateParams(i, section)) {
                    return false;
                }
            }
            return true;
        };

        $scope.isServiceAction = function () {
            return $scope.action.type === 'SERVICE';
        };

        $scope.isMultiple = function (value) {
            var multipleTypes = [
                "SELECT",
                "MULTI_SELECT",
                "MULTI_CHECKBOX",
                "RADIO"
            ];

            return multipleTypes.indexOf(value) >= 0;
        };

        $scope.createWhatsappMessage = function (action) {
            var section = action.sections[0];
            var containsMultiselect = false;
            var message = action.description + "\n";

            for (var index in section.params) {
                var param = section.params[index];
                message += "Pergunta " + (parseInt(index) + 1) + ": " + "\n";
                message += param.title + "\n";

                var createOptions = function (options) {
                    var result = "";
                    for (var i in options) {
                        result += options[i].key + ": " + options[i].value + "\n";
                    }

                    return result;
                };

                switch (param.type) {
                    case "MULTI_SELECT":
                        containsMultiselect = true;
                        message += "Escolha uma ou mais resposta: " + "\n";
                        message += createOptions(param.options);
                        break;
                    case "SELECT":
                        message += "Escolha apenas uma resposta: " + "\n";
                        message += createOptions(param.options);
                        break;
                    default:
                        break;
                }

            }

            if (containsMultiselect) {
                message += "Use " + action.answerSeparator + " para separar as respostas" + "\n";
                message += "Ex: resposta 1" + action.answerSeparator + " resposta 2...";
            }

            if (section.params.length > 1) {
                message += "Use " + action.questionSeparator + " para separar as questões" + "\n";
                message += "Ex: questão 1" + action.questionSeparator + " questão 2...";
            }

            return message;
        };

        $rootScope.$on('save-action', function (event) {
            $scope.saveWithoutSend = true;
            $scope.submit();
        });

        $scope.openModalWhatsAppMessage = function () {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/portal/layout/directive/template/conf-modal-tpl.html",
                size: 'sm',
                controller: function ($scope, $rootScope) {
                    
                    $scope.params = {
                        title: 'Atenção',
                        text: 'Mensagem muito extensa para ser enviada pelo Whatsapp, deseja continuar?'
                    };
                    
                    $scope.ok = function () {
                        $rootScope.$broadcast('save-action');
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });
        };
    });
});
