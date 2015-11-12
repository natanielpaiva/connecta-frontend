define([
    'connecta.maps',
    'maps/presenter-source/service/presenter-source-service'
], function (maps) {
    return maps.lazy.controller('PresenterSourceListController', function ($scope, PresenterSourceService) {

        $scope.presenterSources = null;

        PresenterSourceService.list().then(function (response) {
            $scope.presenterSources = response.data;
        }, function (response) {
        });


        $scope.excluir = function (id) {            
            PresenterSourceService.delete(id).then(function () {
                //Retira um item da lista de presenterSource
                $scope.presenterSources.splice(
                        $scope.presenterSources.indexOf(id), 1);
            });
        };
       
    });
});