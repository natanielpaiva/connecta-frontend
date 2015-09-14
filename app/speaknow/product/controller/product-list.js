define([
    'connecta.speaknow',
    'speaknow/product/service/product-service',
    'speaknow/company/service/company-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ProductList', function ($scope, ProductService, notify,
            ngTableParams, $translate, speaknowResources, sortBy,
            $location, CompanyService) {

        CompanyService.getUserCompany().then(function (response) {
        }, function (data) {
          if(data.status === 401){
            return;
          }
            $translate('WHATSAPP.WITHOUT_COMPANY').then(function (text) {
                notify.warning(text);
                $location.path('speaknow/company/new');
            });
        });

        $scope.currentyDate = new Date().getTime();
        $scope.products = null;
        $scope.productUrl = speaknowResources.base;
        $scope.search = {
            name: ''
        };
        $scope.tableParams = new ngTableParams({
            count: 10,
            page: 1,
            filter: $scope.search
        }, {
            getData: function ($defer, params) {
                return ProductService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    var result = sortBy(response.data.content, "name");
                    $defer.resolve(result);
                });
            },
            counts: [10, 30, 50, 100]
        });

        $scope.delete = function (id) {
            ProductService.delete(id).success(function () {
                notify.success("Produto/Serviço removido com sucesso");
                $scope.tableParams.reload();
            });
        };

        $scope.modalRemoveProduct = {
            title: 'Excluir Produto',
            text: 'Deseja realmente remover o produto?',
            size: 'sm',
            success: $scope.delete
        };
    });
});
