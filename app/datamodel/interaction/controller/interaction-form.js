define([
    'connecta.datamodel',
    'datamodel/interaction/service/interaction-service',
    'portal/layout/service/notify'
], function (datamodel) {
    return datamodel.lazy.controller('InteractionFormController', function ($scope, InteractionService, notify) {

        $scope.fields = InteractionService.getTypeFields();
        $scope.domains = InteractionService.getDomains();
        $scope.domain = {};
        $scope.lastFieldId = 0;
        $scope.form = {
            id: 1,
            name: 'Name',
            fields: []
        };
        $scope.popoverConfig = {
            templateUrl: 'popoverConfig.html',
            title: 'Title'
        };

        $scope.addNewField = function (field) {
            $scope.lastFieldId++;
            if ($scope.form.fields.length === 0) {
                angular.element("#firstField").hide();
            }
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

            $scope.form.fields.push(newField);
        };

        $scope.deleteField = function (id) {
            for (var i = 0; i < $scope.form.fields.length; i++) {
                if ($scope.form.fields[i].id === id) {
                    $scope.form.fields.splice(i, 1);
                    break;
                }
            }
            if ($scope.form.fields.length === 0) {
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

        $scope.reorderItem = function (index, obj) {
            var otherObj = $scope.form.fields[index];
            var otherIndex = $scope.form.fields.indexOf(obj);

            $scope.form.fields[index] = obj;
            $scope.form.fields[otherIndex] = otherObj;
        };

        $scope.fieldSetColumn = function (index, column) {
            for (var i in $scope.form.fields) {
                var field = $scope.form.fields[i];
                if (field.columnName === column.name) {
                    notify.warning("A coluna já está associada a outro field");
                    return;
                }
            }

            var newField = $scope.form.fields[index];
            newField.columnName = column.name;
        };

        $scope.removeFieldColumn = function (field) {
            field.columnName = "";
        };

        $scope.dropField = function (index, field) {
            if (field.isColumn) {
                $scope.fieldSetColumn(index, field);
            } else if (field.id) {
                $scope.reorderItem(index, field);
            } else {
                $scope.addNewField(field);
            }
        };

        $scope.teste = function (ev) {
            ev.event.preventDefault();
            ev.event.stopPropagation();
            return false;
        };

        $scope.submit = function () {
            var param = {};
            var step = {
                name: "Step Name",
                title: "Step Title",
                sections: [
                    {
                        title: "Section Title",
                        params: []
                    }
                ]
            };
            
            var fields = $scope.form.fields;
            for(var index in fields){
                delete fields[index].id;
            }
            
            step.sections[0].params = fields;
            
            var interaction  = {
                name: "Interaction Name",
                description: "Description",
                type: "POLL",
                actions:[
                    {
                        name:"Action Name",
                        description:"Action Description",
                        steps:[step]
                    }
                ]
            };
        };

    });
});