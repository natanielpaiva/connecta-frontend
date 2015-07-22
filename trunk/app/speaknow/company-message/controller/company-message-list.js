define([
    'connecta.speaknow',
    'speaknow/company-message/service/company-message-service'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyMessageListController',
            function ($scope, CompanyMessageService, ngTableParams, $translate) {

                $scope.messages = null;
                $scope.search = {
                    subject: ''
                };
                $scope.tableParams = new ngTableParams({
                    count: 10,
                    page: 1,
                    filter: $scope.search
                }, {
                    getData: function ($defer, params) {
                        return CompanyMessageService.list(params.url()).then(function (response) {
                            params.total(response.data.totalElements);
                            $defer.resolve(response.data.content);
                        });
                    },
                    counts: [10, 30, 50, 100]
                });

            });
});
