define([
    'connecta.speaknow',
    'speaknow/product/service/product-service',
    'portal/layout/service/notify'
], function(speaknow){
    return speaknow.lazy.controller('ProductViewController', 
        function($scope, ProductService, $routeParams, $location, speaknowResources, notify){
        
        $scope.product = {};
        $scope.baseUrl = speaknowResources.base;
        
        if ($routeParams.id) {
            ProductService.get($routeParams.id).success(function(data){
                $scope.product = data;
            });
        } else {
            $location.path('speaknow/product');
        }
        
        $scope.delete = function(id){
             ProductService.delete(id).success(function () {
                notify.success("Produto removido com sucesso");
                $scope.tableParams.reload();
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