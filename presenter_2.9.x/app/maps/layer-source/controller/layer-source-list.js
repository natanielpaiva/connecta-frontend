define([
    'connecta.maps',
    'maps/layer-source/service/layer-source-service'
], function (maps) {
    return maps.lazy.controller('LayerSourceListController', function ($scope, LayerSourceService, ngTableParams,sortBy) {

        $scope.layerSources = null;

//        LayerSourceService.list().then(function (response) {
//            $scope.layerSources = response.data;
//        }, function (response) {
//        });

        $scope.search = {
            name: ''
        };


        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return LayerSourceService.list(params.url()).then(function (response) {
                    if (response.data.length === 0 && $scope.search.name.length > 0) {
                        //notify.warning('LAYOUT.NO_RESULTS');
                    }
                    params.total(response.data.length);
                    console.info("RESPONSE",response);
                    console.info("HKJ",response.data.length);
                    var result = sortBy(response.data, "nm_source");
                    $defer.resolve(result);
                });
            },
            counts: [10, 30, 50, 100]
        });




        $scope.excluir = function (id) {
            LayerSourceService.delete(id).then(function () {
                //Retira um item da lista de layerSource
                $scope.layerSources.splice(
                        $scope.layerSources.indexOf(id), 1);
            });
        };

    });
});