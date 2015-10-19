define([
    'presenter/analysis/service/analysis-service'
], function () {
    return function DatabaseAnalysisFormController($scope, AnalysisService) {



        $scope.databaseForm = {
            selectSourceOfdata: null,
            selectedTable: null
        };

        if ($scope.edit) {

            if ($scope.analysis.table) {
                 $scope.databaseForm.type = 'Table';
                $scope.databaseForm.selectSourceOfdata = 'table';
            } else {
                 $scope.databaseForm.type = 'SQL';
                $scope.databaseForm.selectSourceOfdata = 'sql';
            }
            $scope.component.columns = $scope.analysis.analysisColumns;

        } else {

            $scope.sourceOfdata = [
                {value: "table", name: 'Table'},
                {value: "sql", name: 'SQL'}
            ];

            $scope.$watch('databaseForm.selectSourceOfdata', function (newValue) {
                if (newValue === "table") {
                    var idDataSource = $scope.analysis.datasource.id;
                    AnalysisService.getListTableDatasource(idDataSource).then(function (response) {
                        //preenche o select de tabelas do banco de dados
                        $scope.listTableDatasource = response.data;
                    });
                }
                if (newValue === "sql") {

                }
            });

            $scope.$watch('databaseForm.selectedTable', function (table) {
                if (table !== null) {
                    $scope.analysis.table = table.tableName;
                    
                     $scope.analysis.analysisColumns= [];
                    
                     for (var tb in table.columns) {
                        $scope.analysis.analysisColumns.push({
                            name: table.columns[tb].name,
                            label: table.columns[tb].name,
                            formula: table.tableName + "." + table.columns[tb].name
                        });
                    }
                    
//                    for (var tb in table.columns) {
//                        $scope.component.columns.push({
//                            name: table.columns[tb].name,
//                            label: table.columns[tb].name,
//                            formula: table.tableName + "." + table.columns[tb].name
//                        });
//                    }
                }
            });
        }
    };
});
