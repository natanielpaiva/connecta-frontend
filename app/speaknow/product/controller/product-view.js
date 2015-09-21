define([
    'connecta.speaknow',
    'speaknow/product/service/product-service',
    'portal/layout/service/notify'
], function(speaknow){
    return speaknow.lazy.controller('ProductViewController',
        function($scope, ProductService, $routeParams, $location,
          speaknowResources, notify){

        $scope.product = {};
        $scope.baseUrl = speaknowResources.base;

        if ($routeParams.id) {
            ProductService.get($routeParams.id).then(function(response){
                $scope.product = response.data;
            }, function(error){
                if(error.status === 403){
                    notify.warning("PRODUCT.VIEW_FORBIDDEN");
                }
                $location.path('speaknow/product');
            });
        } else {
            $location.path('speaknow/product');
        }

        $scope.delete = function(id){
             ProductService.delete(id).success(function () {
                notify.success("Produto removido com sucesso");
                $location.path('speaknow/product');
            });
        };

        $scope.modalParams = {
            title: 'Excluir Produto',
            text: 'Deseja realmente remover o produto?',
            size: 'sm',
            success: $scope.delete
        };
    });
});
