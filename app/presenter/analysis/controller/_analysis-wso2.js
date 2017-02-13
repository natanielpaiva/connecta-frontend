define([
    'presenter/analysis/service/analysis-service'
], function () {
    return function Wso2AnalysisFormController($scope, AnalysisService) {

        $scope.analysis.analysisColumns = [];

        if ($scope.edit) {
            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseWso2 = response.data;

                for (var cl in response.data[0]) {
                    $scope.analysis.analysisColumns.push({
                        name: cl,
                        label: cl,
                        formula: cl
                    });
                }
            });

            if ($scope.analysis.searchType === "RANGE") {
                $scope.analysis.to =  dateConverter($scope.analysis.to);
                $scope.analysis.from =  dateConverter($scope.analysis.from);
            }
            $scope.component.columns = $scope.analysis.analysisColumns;
        }else{
            $scope.analysis.searchType = "QUERY";
        }

        function dateConverter(date) {
            var now = new Date(date);
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear() + "-" + (month) + "-" + (day);
            
            return new Date(today + " " + now.toTimeString().slice(0, 8));
        }


        $scope.getResult = function () {
            $scope.responseWso2 = null;
            $scope.analysis.analysisColumns = [];

            $scope.analysis.from = Date.parse($scope.analysis.from);
            $scope.analysis.to = Date.parse($scope.analysis.to);

            AnalysisService.execute({
                analysis: $scope.analysis
            }).then(function (response) {
                $scope.responseWso2 = response.data;

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
