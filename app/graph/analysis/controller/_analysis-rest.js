/* global angular */

define([
    'graph/analysis/service/analysis-service'
], function () {
    return function RestAnalysisFormController($scope, AnalysisService) {
        $scope.analysis.requestVariables = [];
        $scope.analysis.request = null;



        if ($scope.edit) {
            AnalysisService.getAnalysisRest($scope.analysis.id).then(function (response) {
                console.log("ddddd", response.data);
                $scope.analysis.requestVariables = response.data.requestVariables;

                $scope.request = response.data.request;
                factoryBody($scope.request);
            });
        }


        function factoryBody(request) {
            request.parametersBody = [];
            var parameteres = request.body.split("&");
            parameteres.forEach(function (kv) {
                var keyValue = kv.split("=");
                request.parametersBody.push({
                    key: keyValue[0],
                    value: keyValue[1]
                });
            });
        }

        $scope.sendRequest = function () {

            AnalysisService.sendRequest($scope.analysis).then(function (response) {
                $scope.restResponse = response.data;
            });
        };


        $scope.map = function (variables) {
            var variablesMap = {};

            angular.forEach(variables, function (variable) {
                variablesMap[ variable.name ] = variable.value;
            });

            return variablesMap;
        };


        $scope.$watch('restResponse.bodySpecified', function (json) {
            refParentJson(json);
        });

        function refParentJson(parent) {
            var current = null;
            if (parent) {
                if (parent.attributes) {
                    for (var i = 0; i < parent.attributes.length; i++) {
                        current = parent.attributes[i];
                        current.parent = parent;
                        refParentJson(current);
                    }
                }
                if (parent.values) {
                    for (var j = 0; j < parent.values.length; j++) {
                        current = parent.values[j];
                        current.parent = parent;
                        refParentJson(current);
                    }
                }
            }
        }
//
        $scope.generateJsonPathTable = function (parent, array) {
            console.log("tabela");
            if (!angular.isUndefined(parent)) {

                console.log(" --------------- ");
                console.log("parent entrando: ", parent);
                console.log("array entrando: ", array);

                var name;

                if (parent.type === "OBJECT") {
                    console.log("parent.type OBJECT ");
                    name = parent.name;
                    console.log("name ", name);

                    if (name !== undefined) {
                        array.push(name);
                    }
                    $scope.generateJsonPathTable(parent.parent, array);
                }

                if (parent.type === "ARRAY") {
                    console.log("parent.type ARRAY ");
                    name = parent.name;
                    console.log("name ", name);
                    console.log("typeof name === undefined", typeof name === "undefined");

                    if (typeof name === "undefined") {
                        array.push('[*]');
                    } else {
                        name += '[*]';
                        array.push(name);
                    }

                    $scope.generateJsonPathTable(parent.parent, array);
                }

                if (parent.type === "NUMBER" || parent.type === "BOOLEAN" || parent.type === "STRING" || parent.type === "UNKNOWN") {
                    console.log("Number, BOOLEAN, STRING, UNKNOWN");

                    name = parent.name;
                    console.log("name ", name);
                    array.push(name);
                    $scope.generateJsonPathTable(parent.parent, array);
                }

            } else {
                console.log("sem valor o parent");
                console.log(" -------Fim---- ");
                console.log("array: ", array);
                //console.log("array reverse: ", array.reverse());
//                
                var jsonPathTable = array.reverse().join('.');
//                
                console.log("jsonPathTable: ", jsonPathTable);
//                
                $scope.analysis.tablePath = jsonPathTable;
            }
        };

        $scope.analysis.analysisColumns = [];
        $scope.generateJsonPathColumns = function (parent, array) {
            console.log("coluna");
            if (!angular.isUndefined(parent)) {

                console.log(" --------------- ");
                console.log("parent entrando: ", parent);
                console.log("array entrando: ", array);

                var name;

                if (parent.type === "OBJECT") {
                    console.log("parent.type OBJECT ");
                    name = parent.name;
                    console.log("name ", name);

                    if (name !== undefined) {
                        array.push(name);
                    }
                    $scope.generateJsonPathColumns(parent.parent, array);
                }

                if (parent.type === "ARRAY") {
                    console.log("parent.type ARRAY ");
                    name = parent.name;
                    console.log("name ", name);


                    if (typeof name === "undefined") {
                        //name += '[*]';
                        array.push('[*]');
                    } else {
                        name += '[*]';
                        array.push(name);
                    }
//                     if (name !== undefined) {
//                        name += '[*]';
//                        array.push(name);
//                    }

                    $scope.generateJsonPathColumns(parent.parent, array);
                }

                if (parent.type === "NUMBER" || parent.type === "BOOLEAN" || parent.type === "STRING") {
                    console.log("Number, BOOLEAN, STRING");

                    name = parent.name;
                    console.log("name ", name);
                    array.push(name);
                    $scope.generateJsonPathColumns(parent.parent, array);
                }

            } else {

                console.log("sem valor o parent");
                console.log(" -------Fim---- ");
                console.log("array: ", array);

                var nameColumn = array[0];
                console.log("nameColumn ", nameColumn);

                var jsonPathColumns = array.reverse().join('.');

                console.log("$scope.analysis.tablePath: ", $scope.analysis.tablePath);
                console.log("jsonPathColumns: ", jsonPathColumns);

                var path = jsonPathColumns.replace($scope.analysis.tablePath, "");
                var formula = path.replace(".", "");


                console.log("x ", path);
                console.log("$scope.analysis.analysisColumns ", $scope.analysis);

                if (isColumn(formula)) {
                    $scope.analysis.analysisColumns.push({
                        name: nameColumn,
                        label: nameColumn,
                        formula: formula
                    });
                }
                console.log("$scope.$scope.analysis.analysisColumns: ", $scope.component.columns);
            }
        };

        function isColumn(formula) {
            var value = true;
            for (var column in $scope.analysis.analysisColumns) {
                if ($scope.analysis.analysisColumns[column].formula === formula) {
                    value = false;
                }
            }
            return value;
        }

        $scope.getTabularFormatJson = function () {
//            console.log($scope.analysis);
//            return AnalysisService.execute($scope.analysis).then(function (response) {
//                console.log("Super resposta: ", response.data);
//
//                $scope.responseWebservice = response.data;
//            });

            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseRest = response.data;
            });

        };
    };
});
