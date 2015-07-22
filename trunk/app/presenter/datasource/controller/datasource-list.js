define([
    'connecta.presenter',
    'presenter/datasource/service/datasource-service'
], function (presenter) {
    return presenter.lazy.controller('DatasourceListController', function ($scope, DatasourceService, ngTableParams) {

        $scope.types = DatasourceService.getTypes();

        $scope.showFilter = false;
        $scope.filter = {};
        
        $scope.tableParams = new ngTableParams({
            count:100,
            page:1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return DatasourceService.list(params.url()).then(function(response){
                    $scope.datasources = response.data.content;
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts:[100,150,200,250]
        });

        $scope.datasources = [];

        $scope.excluir = function (id) {
            DatasourceService.excluir(id).then(function(){
                //Retira um item da lista de datasource
                $scope.datasources.splice(
                        $scope.datasources.indexOf(id), 1);
            });
        };
    });
});