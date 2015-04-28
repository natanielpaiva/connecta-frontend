define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service'
], function (presenter) {
    return presenter.lazy.controller('AnalysisFormController', function ($scope, AnalysisService) {

        //preenche o combo de datasource
        AnalysisService.getListDatasource().then(function (response) {
            $scope.listDatasource = response.data;
        });


        $scope.columns = [{name: '', label: ''}];

        $scope.attributeTypes = ["Select", "Map", "Date", "Text", "Etc"];

        $scope.attributes = [{params: null, value: "", type: ''}];



        $scope.addMethodAttribute = function () {
            var attr = angular.copy($scope.attribute);

            $scope.attributes.push(attr);
        };

        $scope.removeMethodAttribute = function (attribute) {
            $scope.attributes.splice($scope.attribute.indexOf(attribute), 1);
        };


        //################gerando o tipo de template#####################
        $scope.types = AnalysisService.getTypes();

        $scope.$watch('analysis.datasource.id', function (idDatasouce) {
            var filterCSV = function (value) {
                return value.id.toUpperCase() === "CSV";
            };

            if (idDatasouce === "csv") {
                $scope.analysis.type = $scope.types.filter(filterCSV).pop();
            } else {
                for (var ds  in $scope.listDatasource) {

                    if (idDatasouce === $scope.listDatasource[ds].id.toString()) {
                        console.log($scope.listDatasource[ds].type);
                        var type = $scope.listDatasource[ds].type.toLowerCase();

                        for (var ty in $scope.types) {
                            if ($scope.types[ty].id === type) {
                                //Monta o template de acordo com o datasource
                                $scope.analysis.type = $scope.types[ty];

                                //Verifica se a propriedade o Start existe no array
                                if ($scope.types[ty].hasOwnProperty("start")) {
                                    $scope.types[ty].start(idDatasouce).then(startColumns);
                                }
                            }
                        }
                    }
                }
                startColumns = function (response){
                    //preenche as colunas
                    $scope.columns = response.data;
                };
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
                //tipo todas as colunas
                $scope.columns = [];
                for (var tb in tabela.columns) {
                    $scope.columns.push({
                        name: tabela.columns[tb].name,
                        label: tabela.columns[tb].name,
                        formula: tabela.tableName + "." + tabela.columns[tb].name
                    });
                }
            }
            console.log($scope.columns);
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

        //################Endeca#####################
        $scope.domain = [
            {value: "xxx", name: "xxx"},
            {value: "yyy", name: "yyy"}
        ];

        $scope.typeQuery = [
            {value: "hiveQL", name: "HiveQL"},
            {value: "pigQuery", name: "PigQuery"}
        ];



        $scope.submit = function () {
            //Montando estrutuda de colunas
            console.log($scope.columns);

//            var columnsDatabase = angular.copy($scope.databaseForm.selectedTable.columns);
//            var analysisColumns = [];
//            for (var columns in columnsDatabase) {
//                analysisColumns.push({
//                    name: columnsDatabase[columns].name,
//                    label: columnsDatabase[columns].label,
//                    formula: $scope.databaseForm.selectedTable.tableName + "." + columnsDatabase[columns].name
//                });
//            }
            //add colunas na analysis
            $scope.analysis.analysisColumns = $scope.columns;
            //console.log(analysisColumns);
            AnalysisService.save($scope.analysis).then(function () {
            });
        };
    });
});
