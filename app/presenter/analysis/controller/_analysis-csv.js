define([], function () {
    return function CsvAnalysisFormController($scope) {
       
        alert("CSV");

        $scope.separator = [
            {value: ".", name: '.'},
            {value: ";", name: ';'}
        ];

        $scope.csvType = [
            {value: "fileCsv", name: 'Arquivo CSV'},
            {value: "text", name: 'Texto'}
        ];
    };
});
