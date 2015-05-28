define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'speaknow/interaction/service/interaction-service',
    'speaknow/action/controller/action-modal'
], function (speaknow) {
    /* //TODO
     * validar formulario
     * regras de uplaod de arquivo
     */
    return speaknow.lazy.controller('ActionFormController', function ($scope,
            InteractionService, ActionService, $location, $routeParams, $modal, $translate) {

        $scope.interaction = ActionService.getInteraction();
        
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
            steps: [
                {
                    sections: [angular.copy(section)],
                    name: "Step One",
                    type: "POLL"
                }
            ],
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

        $scope.addParam = function (section) {
            $scope.minifyCard(section.params);
            section.params.push(angular.copy(param));
        };

        $scope.removeParam = function (section, param) {
            section.params.splice(section.params.indexOf(param), 1);
        };

        $scope.finishParam = function(sec_index, index, param){
            if(!$scope.validateParam(sec_index, index, param)){
                return;
            }

            param.max = false;
        };
        
        $scope.onChangeParamType = function (type){
            $scope.showParamOpts = $scope.isMultiple(type);
        };

        var sections = $scope.action.steps[0].sections;
        $scope.addSection = function () {
            $scope.minifyCard(sections);
            sections.push(angular.copy(section));
        };

        $scope.removeSection = function (section) {
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
            $scope.icons = data.icons.slice(0, 100);
        });

        $scope.isEditing = false;

        if ($routeParams.id) {
            $scope.isEditing = true;
            ActionService.get($routeParams.id).success(function (data) {
                $scope.action = data;
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

        // Recupera os tipos de parametros (enum InteractionParameterType)
        $scope.paramTypes = [];
        ActionService.getParamTypes().then(function (response) {
            $scope.paramTypes = response.data;
        });

        $scope.submit = function () {
            if(!$scope.validateSections()){
                return;
            }
            if ($scope.isEditing || !$scope.interaction.id) {
                //TODO trazer a company da Grid
                $scope.interaction.company = {id: 1};
                $scope.interaction.actions = [];
                
                var image = $scope.interaction.image;
                
                delete $scope.interaction.image;
                delete $scope.action.interaction;
                
                $scope.interaction.actions.push($scope.action);
                InteractionService.save($scope.interaction, image).success(function (response) {
                    ActionService.clearInteraction();
                    $location.path('/speaknow/interaction/' + response.id);
                });
            } else {
                $scope.action.interaction = $scope.interaction;
                ActionService.save($scope.action).success(function (response) {
                    ActionService.clearInteraction();
                    $location.path('/speaknow/interaction/' + $scope.action.interaction.id);
                });
            }
        };
        
        /** Validations */
        
        /**
         * Método para validar cada parametro individualmente
         * utilizado no ng-repeat dos parametros de cada Section
         * @param  {number} index - Index do parametro dentro da section
         * @param  {Object} param - O parametro da section do escoppo
         * @return {Boolean} True -> valid e False -> invalid
         */
        $scope.validateParam = function(sec_index, index, param){
            var form = $scope.actionForm;
            var title = form['section'+sec_index+'_param_title_'+index];
            
            if(!title) return;

            title = form['section'+sec_index+'_param_title_'+index].$valid;
            var name = $scope.isServiceAction() ? form['section'+sec_index+'_param_name_'+index].$valid : true;
            var options = $scope.isMultiple(param.type) ? (param.options.length && $scope.validateParamOptions(param.options)) : true;

            return title && name && options;
        };

        $scope.validateParams = function(index, section){

            function checkParams(){
                for(var i in section.params){
                    var param = section.params[i];
                    if(!$scope.validateParam(index, i, param)){
                        return false;
                    }
                }
                return true;
            }

            return section.params.length && checkParams();
            
        };
        
        $scope.validateParamOptions = function (options){
            function verifyEmpty (option){
                return (
                        (!option.value || angular.equals("", option.value)) || 
                        (!option.text || angular.equals("", option.text))
                );
            }
            
            for(var i in options){
                var option = options[i];
                if(angular.equals({}, option) || verifyEmpty(option) ){
                    return false;
                }
            }
            
            return true;
        };

        $scope.validateSections = function(){
            var sections = $scope.action.steps[0].sections;
            for(var i in sections){
                var section = sections[i];
                if(!$scope.validateParams(i, section)){
                    return false;
                }
            }
            return true;
        };
        
        $scope.isServiceAction = function (){
            return $scope.action.type === 'SERVICE';
        };
        
        $scope.isMultiple = function (value) {
            var multipleTypes = [
                "MULTI_SELECT",
                "MULTI_CHECKBOX",
                "RADIO"
            ];
            
            return multipleTypes.indexOf(value) >= 0;
        };
    });
});