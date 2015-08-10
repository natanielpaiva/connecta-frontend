define([
    'connecta.speaknow',
    'speaknow/action/service/action-service'
], function (speaknow) {
    return speaknow.lazy.controller('AccountDefaultList', function (
            $scope, ActionService, ngTableParams
            ) {

        $scope.search = {
            name:''
        };
        $scope.tableParams = new ngTableParams({ 
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ActionService.listDefaultAccounts(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
        

    });
});