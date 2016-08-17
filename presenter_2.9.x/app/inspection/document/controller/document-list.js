define([
    'connecta.inspection',
    'inspection/document/service/document-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('DocumentListController', function (
            $scope, DocumentService, ngTableParams) {

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return DocumentService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data);
                });
            },
            counts: [10, 30, 50, 100]
        });

    });
});