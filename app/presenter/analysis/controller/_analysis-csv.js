define([
], function () {
    return function CsvAnalysisFormController($scope, AnalysisService, dataURI) {


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
            dataURI(val).then(function(string) {
                $scope.analysis.binaryFile = decodeURIComponent(
                    escape(
                        atob(string.split('base64,')[1])
                    )
                );
            });
        });

        $scope.getDataCsv = function () {
            //remove o datasource (csv não pode ter datasource)
            var analysisCopy = angular.copy($scope.analysis);
            delete analysisCopy.datasource;
            AnalysisService.getResultCSV(analysisCopy).then(function (response) {

                $scope.responseCSV = response.data;
                $scope.analysis.analysisColumns = [];
                for (var cl in response.data[0]) {
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
