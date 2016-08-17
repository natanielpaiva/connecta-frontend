define([
    'connecta.speaknow',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('CompanyListController', function ($scope, 
        CompanyService, notify, ngTableParams, sortBy) {

        $scope.companies = null;
        $scope.search = {
            name: ''
        };
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return CompanyService.list(params.url()).then(function (response) {
//                    Código para search desativado enquanto o usuário só tem uma company
//                    if (response.data.content.length === 0 
//                            && $scope.search.name.length > 0) {
//                        $translate('COMPANY.NO_RESULT').then(function (text) {
//                            notify.warning(text);
//                        });
//                    }
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data.content, "name");
                    $defer.resolve(result);
                });
            },
            counts: [10, 30, 50, 100]
        });

        $scope.getEmail = function(company){
            for(var i in company.mainContacts){
                if(company.mainContacts[i].type === "EMAIL"){
                    return company.mainContacts[i].value;
                }
            }
        };

        $scope.delete = function (id) {
            CompanyService.delete(id).success(function () {
                notify.success('COMPANY.REMOVE_SUCCESS');
                $scope.tableParams.reload();
            });
        };

        $scope.modalParams = {
            title: 'Exclusão de empresa',
            text: 'Deseja realmente excluir a empresa?',
            size: 'sm',
            success: $scope.delete
        };
    });
});