define([
    'connecta.inspection',
    'inspection/product-item/service/product-item-service',
    'portal/layout/service/notify'
], function (inspection) {
    return inspection.lazy.controller('ProductItemListController', function (
            $scope, ProductItemService, ngTableParams, notify, $translate, $location) {

        $scope.productItem = null;

        $scope.remove = function (id) {
            ProductItemService.delete(id).then(function () {
                $translate('PRODUCT_ITEM.REMOVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection/product/item');
                });
            }, function (response) {
                $translate('PRODUCT_ITEM.ERROR_REMOVING').then(function (text) {
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
                return ProductItemService.list(params.url()).then(function (response) {
                    params.total(response.data.totalElements);
                    $defer.resolve(response.data.content);
                });
            },
            counts: [10, 30, 50, 100]
        });

    });
});