define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service',
    'presenter/viewer/controller/modal-instance-ctrl'
], function (presenter) {
    return presenter.lazy.controller('ViewerListController', function ($scope, ViewerService, ngTableParams, $modal) {
        $scope.viewers = [];
        $scope.tableParams = new ngTableParams({
            count: 100,
            page: 1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return ViewerService.list(params.url()).then(function (response) {
                    $scope.viewers = response.data;
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [100, 150, 200, 250]
        });



        $scope.delete = function (id) {
            ViewerService.delete(id).then(function () {
                //Retira um item da lista de datasource
                $scope.viewers.splice(
                        $scope.viewers.indexOf(id), 1);
            });
        };

        $scope.open = function (size) {

            $modal.open({
                animation: true,
                templateUrl: 'app/presenter/viewer/template/_template-types.html',
                controller: 'ModalInstanceCtrl',
                size: size

            });
        };

    });
});