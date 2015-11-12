define([
    'presenter/analysis/service/analysis-service'
], function () {//atividade interna
    return function DatabaseAnalysisFormController($scope, AnalysisService) {

        $scope.databaseForm = {
            selectSourceOfdata: null,
            selectedTable: null
        };

        if ($scope.edit) {

            if ($scope.analysis.table) {
                $scope.databaseForm.type = 'Table';
                $scope.databaseForm.selectSourceOfdata = 'table';
                AnalysisService.executeSqlDataBase($scope.analysis).then(function (response) {
                    $scope.responseDataBaseTable = response.data;

                });


            } else {
                $scope.databaseForm.type = 'SQL';
                $scope.databaseForm.selectSourceOfdata = 'sql';
                AnalysisService.executeSqlDataBase($scope.analysis).then(function (response) {
                    $scope.responseDataBase = response.data;
                      console.log($scope.responseDataBase);
                    
                });
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

                    $scope.analysis.analysisColumns = [];

                    for (var tb in table.columns) {
                        $scope.analysis.analysisColumns.push({
                            name: table.columns[tb].name,
                            label: table.columns[tb].name,
                            formula: table.tableName + "." + table.columns[tb].name
                        });
                    }

                    AnalysisService.executeSqlDataBase($scope.analysis).then(function (response) {
                        $scope.responseDataBaseTable = response.data;

                    });
                }
            });
        }


        $scope.executeSQL = function () {

            AnalysisService.executeSqlDataBase($scope.analysis).then(function (response) {
                $scope.responseDataBase = response.data;
                $scope.analysis.analysisColumns = [];
                for (var cl in response.data[0]) {
                    //var name = cl.split(".");
                    $scope.analysis.analysisColumns.push({
                        name: cl,
                        label: cl,
                        formula: cl
                    });

                }
            });
        };
    };
});
