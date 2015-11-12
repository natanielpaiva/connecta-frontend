define([
    'connecta.inspection',
    'inspection/medias/service/media-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('MediaListController', function (
            $scope, MediaService, ngTableParams) {

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return MediaService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

    });
});