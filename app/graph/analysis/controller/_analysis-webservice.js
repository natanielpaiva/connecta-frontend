define([
], function () {
    return function WebserviceAnalysisFormController($scope, AnalysisService) {
        //alert("webservice");

        var XmlNodeType = {
            ELEMENT: 1,
            ATTRIBUTE: 2,
            ROOT: 9
        };

        $scope.executMethodSoap = function () {
            console.log("executMethodSoap");
            return AnalysisService.getSoap($scope.analysis.datasource.id, $scope.operation, $scope.analysis.webserviceAnalysisParameter).then(function (response) {
                //$scope.webserviceSoapJsonTest = angular.copy(response.data);
                refParentOnChildren(response.data);
                $scope.responseMethodSoap = response.data;

                console.log("$scope.responseMethodSoap", $scope.responseMethodSoap);
            });
        };


        $scope.getTabularFormartResultSoap = function () {
            //$scope.analysis.analysisColumns = $scope.component.columns;
            //$scope.analysis.webserviceAnalysisParameter = $scope.parametersWebservice;
            console.log("Agora vai: ", $scope.analysis);
            return AnalysisService.getResulApplyingXpath($scope.analysis, $scope.operation).then(function (response) {
                console.log("Super resposta: ", response.data);
                $scope.responseWebservice = response.data;
            });
        };


        $scope.getTabularFormartResultRest = function () {
            //$scope.analysis.analysisColumns = $scope.component.columns;
            console.log($scope.analysis);
            return AnalysisService.getResulApplyingJson($scope.analysis.datasource.id, $scope.analysis).then(function (response) {
                console.log("Super resposta: ", response.data);

                $scope.responseWebservice = response.data;
            });
        };

        if ($scope.edit) {
           
            if ($scope.analysis.datasource.typeWebservice === "REST") {
                return AnalysisService.getResulApplyingJson($scope.analysis.datasource.id, $scope.analysis).then(function (response) {
                    $scope.responseWebservice = response.data;
                });
            }

            if ($scope.analysis.datasource.typeWebservice === "SOAP") {
                return AnalysisService.getResulApplyingXpath($scope.analysis, $scope.analysis.method).then(function (response) {
                    $scope.responseWebservice = response.data;
                });
            }


        } else {
            console.log("new");

            $scope.analysis.analysisColumns = [];
            $scope.analysis.datasource.typeWebservice = $scope.datasourceCurrent.typeWebservice;

            $scope.operation = null;

            $scope.$watch('analysis.method', function (operation) {

                for (var ow in $scope.component.operationWebservice) {
                    if ($scope.component.operationWebservice[ow].operation === operation) {
                        //console.log("operation:  ", $scope.component.operationWebservice[ow].operation);
                        $scope.operation = $scope.component.operationWebservice[ow].operation;
                        //console.log("datasourceCurrent", datasourceCurrent);
                        //console.log("$scope.analysis: ", $scope.analysis);

                        console.log($scope.component.operationWebservice[ow].params);
                        $scope.analysis.webserviceAnalysisParameter = $scope.component.operationWebservice[ow].params;
                        //$scope.parametersWebservice = $scope.component.operationWebservice[ow].params;
                    }
                }
            });


        }





        function refParentOnChildren(parent) {
            for (var i = 0; i < parent.childNodes.length; i++) {
                var current = parent.childNodes[i];
                current.parent = parent;

                for (var attrName in current.attributes) {
                    var currentAttr = current.attributes[attrName];
                    currentAttr.parent = current;
                }

                if (current.childNodes && current.childNodes.length) {
                    refParentOnChildren(current);
                }
            }
        }

        $scope.generateXPathTable = function (current, array) {
            var name = current.nodeName;
            array.push(name);
            var xpath;
            if (current.parent && current.parent.nodeType !== XmlNodeType.ROOT) {
                xpath = $scope.generateXPathTable(current.parent, array);
            } else {
                xpath = '/' + array.reverse().join('/');
                $scope.analysis.tablePath = xpath;
            }
        };

        var column = null;
        $scope.generateXPathColumns = function (current, array) {
            var name = current.nodeName;

            array.push(name);
            var xpath;
            if (current.parent && current.parent.nodeType !== XmlNodeType.ROOT) {
                xpath = $scope.generateXPathColumns(current.parent, array);
            } else {
                column = array.shift();
                xpath = '/' + array.reverse().join('/');

                $scope.analysis.analysisColumns.push({
                    name: '/' + column,
                    label: column,
                    formula: xpath + "/" + column
                });
            }
            return xpath;
        };

        $scope.generateXPathAttribute = function (current, array) {
            var name = current.nodeName;
            if (current.nodeType === XmlNodeType.ATTRIBUTE) {
                column = name;
                name = "";
                console.log("-------------", name);
            }
            array.push(name);
            var xpath;
            if (current.parent && current.parent.nodeType !== XmlNodeType.ROOT) {
                xpath = $scope.generateXPathAttribute(current.parent, array);

            } else {
                xpath = '/' + array.reverse().join('/');
                console.log("xpathdess: ", xpath);

                $scope.analysis.analysisColumns.push({
                    name: "@" + column,
                    label: "@" + column,
                    formula: xpath.substring(0, (xpath.length - 1)) + "@" + column
                });
            }
            return xpath;
        };





        // Json
        $scope.$watch('component.webserviceRestJson', function (json) {
                       console.log("sssssssssssssssssssssssssssssssssss", json);
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
                        //name += '[*]';
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

                var x = jsonPathColumns.replace($scope.analysis.tablePath, "");

                console.log("x: ", x);
                // $scope.component.columns.push({
                $scope.analysis.analysisColumns.push({
                    name: nameColumn,
                    label: nameColumn,
                    formula: x.replace(".", "")
                });

                console.log("$scope.$scope.analysis.analysisColumns: ", $scope.component.columns);
            }
        };






    };
});
