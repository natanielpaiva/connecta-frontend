define([
    'connecta.presenter',
    'presenter/analysis/service/analysis-service'
], function (presenter) {
    return presenter.lazy.controller('AnalysisListController', function ($scope, AnalysisService, ngTableParams) {

        
         $scope.tableParams = new ngTableParams({
            count:100,
            page:1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return AnalysisService.list(params.url()).then(function(response){
                    $scope.analysis = response.data;
                    console.log(response.data);
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts:[100,150,200,250]
        });
        
        
        $scope.excluir = function (id) {
                AnalysisService.remove(id).then(function(){
               
               console.log("$scope.analysis ",$scope.analysis.content);
                    $scope.analysis.content.splice(
                            $scope.analysis.content.indexOf(id), 1);
                    //$location.path('presenter/analysis');
                });
            };

    });
});
