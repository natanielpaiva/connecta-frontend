define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service',
    'portal/layout/service/confirm'
], function (presenter) {
    return presenter.lazy.controller('AnalysisListController', function ($scope, $confirm, AnalysisService, ngTableParams) {

        $scope.types = AnalysisService.getTypes();
        
        $scope.tableParams = new ngTableParams({
            count:50,
            page:1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return AnalysisService.list(params.url()).then(function(response){
                    $scope.analysisList = response.data.content;
                });
            },
            counts:[50,100,150,200]
        });

        $scope.bulkRemove = function (analysisList) {
            $confirm('ANALYSIS.BULK_DELETE_CONFIRM', 'ANALYSIS.BULK_CONFIRM_DELETE').then(function(){
                AnalysisService.bulkRemove(analysisList).then(function(){
                    angular.forEach(analysisList, function(analysis){
                        $scope.analysisList.splice(
                            $scope.analysisList.indexOf(analysis), 1);
                    });
                });
            });
        };

    });
});
