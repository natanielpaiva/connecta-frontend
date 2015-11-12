define([
    'connecta.datamodel',
    'datamodel/analysis/service/analysis-service',
    'datamodel/datasource/service/datasource-service'
], function (datamodel) {
    return datamodel.lazy.controller('AnalysisFormController', function ($scope, AnalysisService, DatasourceService) {

        var XmlNodeType = {
            ELEMENT: 1,
            ATTRIBUTE: 2,
            ROOT: 9
        };

        var datasourceCurrent = null;

        //preenche o combo de datasource
        DatasourceService.list({count: 1000, page: 1}).then(function (response) {
            $scope.listDatasource = response.data.content;
        });

        function resetComponent() {
            if (!$scope.component) {
                $scope.component = {};
            }
            $scope.component.catalog = [];
            $scope.component.columns = [];
            $scope.component.domain = [];
            $scope.component.typeWebservice = [];
            $scope.component.operationWebservice = [];
        }
        resetComponent();

        // $scope.$watch('component.catalog', $log.debug);
        // $scope.$watch('component.column', $log.debug);

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

//        $scope.attributes = [{params: null, value: "", type: ''}];
//
//
//
//        $scope.addMethodAttribute = function () {
//            var attr = angular.copy($scope.attribute);
//
//            $scope.attributes.push(attr);
//        };
//
//        $scope.removeMethodAttribute = function (attribute) {
//            $scope.attributes.splice($scope.attribute.indexOf(attribute), 1);
//        };


        //################gerando o tipo de template#####################
        $scope.types = AnalysisService.getTypes();

        $scope.$watch('analysis.datasource.id', function (idDatasouce) {
            for (var ds  in $scope.listDatasource) {

                if (idDatasouce === $scope.listDatasource[ds].id.toString()) {

                    datasourceCurrent = $scope.listDatasource[ds];
                    //console.log("datasourceCurrent: ", datasourceCurrent);
                    //Monta o template de acordo com o datasource
                    $scope.analysis.type = $scope.types[datasourceCurrent.type];
                    if ($scope.types[datasourceCurrent.type].start) {
                        resetComponent();

                        $scope.types[datasourceCurrent.type].start(
                                datasourceCurrent,
                                $scope.component
                                );
                    }
                }
            }
        });

        //################Banco de Dados#####################
        $scope.databaseForm = {
            selectSourceOfdata: null,
            selectedTable: null,
            test: null
        };

        $scope.listTableDatasource = [
            {name: "table", label: 'Table'},
            {name: "sql", label: 'SQL'}
        ];

        $scope.sourceOfdata = [
            {value: "table", name: 'Table'},
            {value: "sql", name: 'SQL'}
        ];

        //assistindo a mudança do select "Origem dos Dados"
        $scope.$watch('databaseForm.selectSourceOfdata', function (newValue) {
            if (newValue === "table") {
                var idDataSource = $scope.analysis.datasource.id;
                AnalysisService.getListTableDatasource(idDataSource).then(function (response) {
                    //preenche o select de tabelas do banco de dados
                    $scope.listTableDatasource = response.data;
                });
            }
        });

        $scope.$watch('databaseForm.selectedTable', function (tabela) {

            if (tabela !== null) {

                console.log("Tabela: ", tabela);
                //limpa todas as colunas
                //$scope.component.columns = {};
                resetComponent();
                console.log("limpa todas as colunas ", $scope.component.columns);
                for (var tb in tabela.columns) {
                    console.log("tb: ", tb);
                    console.log("tabela.columns[tb].name: ", tabela.columns[tb]);
                    $scope.component.columns.push({
                        name: tabela.columns[tb].name,
                        label: tabela.columns[tb].name,
                        formula: tabela.tableName + "." + tabela.columns[tb].name
                    });
                    console.log("$scope.component.columns ", $scope.component.columns);
                }
            }
        });

        //################CSV#####################
        $scope.separator = [
            {value: ".", name: '.'},
            {value: ";", name: ';'}
        ];

        $scope.csvType = [
            {value: "fileCsv", name: 'Arquivo CSV'},
            {value: "text", name: 'Texto'}
        ];

        //################Endeca###################
        $scope.$watch('analysis.domain', function (domain) {
            if ($scope.component.domain !== null && domain !== undefined) {
                return AnalysisService.getListColumnsEndeca(datasourceCurrent.id, domain).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        });

        //################HDFS#####################
        $scope.typeQuery = [
            {value: "hiveQL", name: "HiveQL"},
            {value: "pigQuery", name: "PigQuery"}
        ];

        //################Obiee#####################
        $scope.getCatalog = function (scope, item) {
            scope.toggle();
            var IdDatosource = $scope.analysis.datasource.id;

            //muda o icon para uma pasta aberta
            scope.$modelValue.icon = "glyphicon glyphicon-folder-open";

            //caso seja uma pasta
            if (item.type === "folder") {
                return AnalysisService.getListCatologBiee(IdDatosource, item.path).then(function (response) {
                    item.items = response.data;

                    for (var it in item.items) {

                        if (item.items[it].type === "folder") {
                            item.items[it].icon = "glyphicon glyphicon-folder-close";
                        }
                        if (item.items[it].type === "object") {
                            item.items[it].icon = "glyphicon glyphicon-signal";
                        }
                    }
                });
            } else if (item.type === "object") {
                return AnalysisService.getListColumnsObiee(IdDatosource, item.path).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        };
        //################WebService#####################
        $scope.operation = null;
        $scope.$watch('analysis.method', function (operation) {

            for (var ow in $scope.component.operationWebservice) {
                if ($scope.component.operationWebservice[ow].operation === operation) {
                    //console.log("operation:  ", $scope.component.operationWebservice[ow].operation);
                    $scope.operation = $scope.component.operationWebservice[ow].operation;
//                        console.log("datasourceCurrent", datasourceCurrent);
//                        console.log("$scope.analysis: ", $scope.analysis);
                    $scope.parametersWebservice = $scope.component.operationWebservice[ow].params;
                }
            }
        });

        $scope.getValueWebservice = function () {
            
            return AnalysisService.getSoap(datasourceCurrent.id, $scope.operation, $scope.parametersWebservice).then(function (response) {
                $scope.webserviceSoapJsonTest = angular.copy(response.data);
                refParentOnChildren(response.data);
                $scope.webserviceSoapJson = response.data;
            });
        };

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
                xpath = '/' + array.reverse().join('/') ;
                 $scope.component.columns.push({
                    name: '/' + column,
                    label: column,
                    formula: xpath + "/"+column 
                });
            }
            return xpath;
        };
        
        $scope.generateXPathAttribute = function (current, array) {
            var name = current.nodeName;
            if (current.nodeType===XmlNodeType.ATTRIBUTE) {
                console.log("Attribute");
                column = name; 
                name = "";
                console.log("-------------", name );
            }
            array.push(name);
            var xpath;
            if (current.parent && current.parent.nodeType !== XmlNodeType.ROOT) {
                xpath = $scope.generateXPathAttribute(current.parent, array);

            } else {
                xpath = '/' + array.reverse().join('/') ;
                console.log("xpathdess: ",xpath);
                 $scope.component.columns.push({
                    name: "@"+column,
                    label: "@"+column,
                    formula: xpath.substring(0,(xpath.length - 1)) + "@"+column
                });
            }
            return xpath;
        };

        $scope.getResultSoap = function () {
               $scope.analysis.analysisColumns = $scope.component.columns;
               $scope.analysis.webserviceAnalysisParameter = $scope.parametersWebservice;
           console.log("Agora vai: ", $scope.analysis);
//            
            return AnalysisService.getResulApplyingXpath(datasourceCurrent.id, $scope.analysis, $scope.operation).then(function (response) {
               console.log("Super resposta: ", response.data);
               $scope.responseWebserviceSoapJson = response.data;
            });
        };

        $scope.submit = function () {

            $scope.analysis.analysisColumns = $scope.component.columns;
            console.log($scope.analysis);
            AnalysisService.save($scope.analysis).then(function () {
            });
        };

    });
});


//               

//        $scope.generateXPath = function(current, array) {
//            var name = current.nodeName;
//            
//            
//            if (current.isArray) {
//                name+="[*]";
//            }
//            
//            if (current.nodeType===XmlNodeType.ATTRIBUTE) {
//                name = "@"+name;
//            }
//            
//            array.push(name);
//            
//            var xpath;
//            if (current.parent && current.parent.nodeType !== XmlNodeType.ROOT) {
//                xpath = $scope.generateXPath(current.parent, array);
//            } else {
//                //console.log(array);
//                xpath = '/' + array.reverse().join('/');
//            }
//            console.log("Campo: ", xpath);
//            return xpath;
//        };