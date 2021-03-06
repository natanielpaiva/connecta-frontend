define([
], function () {
    return function CsvAnalysisFormController($scope, AnalysisService, dataURI) {

        $scope.analysisColumnsCopy = undefined;

        if($scope.edit && $scope.analysisColumnsCopy === undefined){
            $scope.analysisColumnsCopy = angular.copy($scope.analysis.analysisColumns);
        }

        $scope.separator = [
            {value: "COMMA", name: ','},
            {value: "SEMICOLON", name: ';'}
        ];

        $scope.quote = [
            {value: "QUOTE", name: '\''},
            {value: "DOUBLE_QUOTE", name: '\"'}
        ];

        $scope.csvType = [
            {value: "file", name: 'Arquivo CSV'},
            {value: "text", name: 'Texto'}
        ];
        
        $scope.csv = {
            file:null
        };

        $scope.$watch('csv.file', function (val) {
            if (val) {
                dataURI(val, true).then(function(string) {
                    $scope.analysis.binaryFile = string;
                });
            }
        });

        $scope.getDataCsv = function () {
            //remove o datasource (csv não pode ter datasource)
            var analysisCopy = angular.copy($scope.analysis);
            delete analysisCopy.datasource;

            $scope.analysis.analysisColumns = [];

            AnalysisService.getResultCSV(analysisCopy).then(function (response) {
                $scope.responseCSV = response.data;
                fillAnalysisColumns(response.data[0]);

                if($scope.analysisColumnsCopy !== undefined &&
                        $scope.analysis.analysisColumns !== undefined){

                    $scope.analysisColumnsCopy.forEach(function(analysisColumn){
                        $scope.analysis.analysisColumns.forEach(function(analysisColumnNew, index){
                            if(analysisColumn.formula === analysisColumnNew.formula){
                                $scope.analysis.analysisColumns[index] = analysisColumn;
                            }
                        });
                    });
                }

            });

        };

        var fillAnalysisColumns = function(responseCsv){
            for (var cl in responseCsv) {
                $scope.analysis.analysisColumns.push({
                    name: cl,
                    label: cl,
                    formula: cl
                });
            }
        };

    };
});
