define([
    'connecta.speaknow',
    'speaknow/action/service/action-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('AccountDefaultList', function (
            $scope, ActionService, ngTableParams, CompanyService, $translate, $location,
            notify
            ) {

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }
            $translate('PRODUCT.WITHOUT_COMPANY').then(function (text) {
                notify.warning(text);
                $location.path('speaknow/company/new');
            });
        });

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
