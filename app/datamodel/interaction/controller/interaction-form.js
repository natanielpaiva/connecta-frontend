define([
    'connecta.datamodel',
    'datamodel/interaction/service/interaction-form-service',
    'portal/layout/service/notify'
], function (datamodel) {
    return datamodel.lazy.controller('InteractionFormController', function ($scope, InteractionFormService, notify) {
        $scope.sectionId = 0;
        $scope.currentSection = 0;
        $scope.sections = [
            {
                id: $scope.sectionId,
                name: 'Name',
                params: []
            }
        ];
        $scope.params = InteractionFormService.getTypeFields();
        $scope.domains = InteractionFormService.getDomains();
        $scope.domain = {};
        $scope.lastFieldId = 0;
        $scope.popoverConfig = {
            templateUrl: 'popoverConfig.html',
            title: 'Title'
        };

        $scope.viewSection = function (sectionId) {
            $scope.currentSection = sectionId;
        };

        $scope.addNewField = function (field, sectionId) {
            $scope.lastFieldId++;
            var newField = {
                "id": $scope.lastFieldId,
                "title": "Field - " + ($scope.lastFieldId),
                "type": field.value,
                "value": "",
                "columnName": "",
                "required": true
            };

            if ($scope.containsOptions(newField)) {
                $scope.addOption(newField);
                $scope.addOption(newField);
            }

            $scope.sections[sectionId].params.push(newField);
        };

        $scope.addNewSection = function () {
            $scope.sectionId++;
            var newForm = {
                id: $scope.sectionId,
                name: 'Section ' + $scope.sectionId,
                params: []
            };
            $scope.sections.push(newForm);
        };

        $scope.deleteField = function (fieldId, sectionId) {
            var section = $scope.sections[sectionId];
            for (var i = 0; i < section.params.length; i++) {
                if (section.params[i].id === fieldId) {
                    section.params.splice(i, 1);
                    break;
                }
            }
            if (section.params.length === 0) {
                angular.element("#firstField").show();
            }
        };

        $scope.addOption = function (field) {
            if (!field.options)
                field.options = [];

            var lastOptionID = 0;

            if (field.options[field.options.length - 1])
                lastOptionID = field.options[field.options.length - 1].id;

            var newId = lastOptionID + 1;

            var newOption = {
                "id": newId,
                "title": "Option " + newId,
                "value": newId
            };

            field.options.push(newOption);
        };

        $scope.deleteOption = function (field, option) {
            for (var i = 0; i < field.options.length; i++) {
                if (field.options[i].id == option.id) {
                    field.options.splice(i, 1);
                    break;
                }
            }
        };

        $scope.containsOptions = function (field) {
            if (field.type == "radio" || field.type == "checkbox" || field.type == 'select')
                return true;
            else
                return false;
        };

        $scope.reorderItem = function (index, obj, sectionId) {
            var section = $scope.sections[sectionId];
            var otherObj = section.params[index];
            var otherIndex = section.params.indexOf(obj);

            var otherObjId = otherObj.id;
            var otherIndexId = obj.id;
            
            obj.id = otherObjId;
            otherObj.id = otherIndexId;
            
            section.params[index] = obj;
            section.params[otherIndex] = otherObj;
        };

        $scope.fieldSetColumn = function (index, column, sectionId) {
            var section = $scope.sections[sectionId];
            for (var i in section.params) {
                var field = section.params[i];
                if (field.columnName === column.name) {
                    notify.warning("A coluna já está associada a outro field");
                    return;
                }
            }

            var newField = section.params[index];
            newField.columnName = column.name;
        };

        $scope.removeFieldColumn = function (field) {
            field.columnName = "";
        };

        $scope.dropField = function (index, field, sectionId) {
            if (field.isColumn) {
                $scope.fieldSetColumn(index, field, sectionId);
            } else if (field.id) {
                $scope.reorderItem(index, field, sectionId);
            } else {
                $scope.addNewField(field, sectionId);
            }
        };

        $scope.reorderSection = function (index, obj) {
            var otherObj = $scope.sections[index];
            var otherIndex = $scope.sections.indexOf(obj);

            $scope.sections[index] = obj;
            $scope.sections[otherIndex] = otherObj;
        };

        $scope.submit = function () {
            var param = {};
            var step = {
                name: "Step Name",
                title: "Step Title",
                sections: [$scope.sections]
            };

            var params = $scope.form.params;
            for (var index in params) {
                delete params[index].id;
            }

            step.sections[0].params = params;

            var interaction = {
                name: "Interaction Name",
                description: "Description",
                type: "POLL",
                actions: [
                    {
                        name: "Action Name",
                        description: "Action Description",
                        steps: [step]
                    }
                ]
            };
        };

//        var lol = {
//                "id": $scope.lastFieldId,
//                "title": "Field - " + ($scope.lastFieldId),
//                "type": 'text',
//                "value": "",
//                "columnName": "",
//                "required": true
//            };
//        $scope.addNewField(lol, 0);
//        $scope.addNewSection();
//        $scope.addNewField(lol, 1);


        $scope.models = {
            selected: null,
            lists: {"A": [], "B": []}
        };

        // Generate initial model
        for (var i = 1; i <= 3; ++i) {
            $scope.models.lists.A.push({label: "Item A" + i});
            $scope.models.lists.B.push({label: "Item B" + i});
        }

        // Model to JSON for demo purpose
        $scope.$watch('models', function (model) {
//            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


    });
});