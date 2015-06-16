define([
    'connecta.speaknow',
    'speaknow/product/service/product-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ProductForm',
            function ($scope, $routeParams, $location, ProductService, notify, speaknowResources) {

                $scope.product = {
                    name: "",
                    code: "",
                    type: "",
                    productReference: null
                };
                $scope.productImage = null;
                $scope.image = null;
                $scope.productName = null;
                $scope.products = [];
                $scope.productNotExist = false;
                $scope.newProductReference = false;
                $scope.baseUrl = speaknowResources.base;

                if ($routeParams.id) {
                    ProductService.get($routeParams.id).success(function (data) {
                        $scope.product = data;
                        $scope.productReference = data;
                    });
                }

                ProductService.getMeasureTypes().then(function (response) {
                    $scope.measureTypes = response.data;
                });

                ProductService.getCategories().then(function (response) {
                    $scope.categories = response.data;
                });

                $scope.submit = function () {
                    $scope.product.subcategory = angular.fromJson($scope.subcategory);
                    $scope.product.name = $scope.product.productReference.name;
                    ProductService.save($scope.product, $scope.productImage).then(function () {
                        $location.path('speaknow/product');
                    }, function (response) {
                    });
                };

                $scope.fileDropped = function (files) {
                    if (files && files.length) {
                        $scope.productImage = files[0];
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $scope.image = e.target.result;
                            $scope.$apply();
                        };
                        reader.readAsDataURL(files[0]);
                    }
                };

                $scope.search = function () {
                    ProductService.searchProductReference($scope.productName).then(function (response) {
                        if (response.data.length > 0) {
                            $scope.productReference = null;
                            $scope.product.name = null;
                            $scope.product.code = null;
                            $scope.products = response.data;
                            $scope.productNotExist = true;
                        } else {
                            notify.warning("Nãa foi encontrado nenhum produto.");
                            $scope.productNotExist = true;
                            $scope.products = [];
                        }
                    });
                };

                $scope.setProductReference = function (productReference) {
                    $scope.product.productReference = productReference;
                    $scope.products = [];
                    $scope.productNotExist = false;
                };

                $scope.createProductReference = function () {
                    $scope.newProductReference = true;
                    $scope.products = [];
                    $scope.productNotExist = false;
                };

                $scope.modalCreateProduct = {
                    title: 'Excluir Produto',
                    text: 'Deseja realmente remover o produto?',
                    size: 'sm',
                    success: $scope.delete
                };

                $scope.delete = function (id) {
                    ProductService.delete(id).success(function () {
                        notify.success("Produto removido com sucesso");
                        $scope.tableParams.reload();
                    });
                };
                
                $scope.showForm = function(){
                    var isService = $scope.product.type == 'SERVICE';
                    var isNewOrReferenceExists = $scope.newProductReference || $scope.product.productReference !== null;
                    var isProduct = $scope.product.type == 'PRODUCT';
                    return isService ||  (isNewOrReferenceExists && isProduct);
                };

            });
});