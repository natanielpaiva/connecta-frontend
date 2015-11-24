define([], function() {
    return function EndecaAnalysisFormController($scope) {
    //    alert("endeca");
        
        $scope.$watch('analysis.domain', function (domain) {
            if ($scope.component.domain !== null && domain !== undefined) {
                return AnalysisService.getListColumnsEndeca(datasourceCurrent.id, domain).then(function (response) {
                    $scope.component.columns = response.data;
                });
            }
        });
    };
});
