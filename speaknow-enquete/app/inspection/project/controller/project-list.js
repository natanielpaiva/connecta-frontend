define([
    'connecta.inspection',
    'inspection/project/service/project-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ProjectListController', function (
            $scope, ProjectService, ngTableParams, notify, $translate, $location) {

        $scope.project = null;

        $scope.remove = function (id) {
            ProjectService.delete(id).then(function () {
                $translate('PROJECT.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/product/item');
                });
            }, function (response) {
                $translate('PROJECT.ERROR_REMOVING').then(function (text) {
                    notify.error(text);
                    $location.path('inspection/product/item');
                });
            });
        };

        //Parâmetros da Modal
        $scope.modalParams = {
            title: "",
            text: "",
            size: 'sm',
            success: $scope.remove
        };

        $scope.search = {
            name: ''
        };

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ProjectService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

    });
});