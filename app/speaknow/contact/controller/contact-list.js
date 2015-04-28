define([
    'connecta.speaknow',
    'speaknow/contact/service/contact-service'
], function (speaknow) {
    return speaknow.lazy.controller('ContactListController', function ($scope, ContactService, ngTableParams) {

        $scope.contacts = null;

        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ContactService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });
    });
});
