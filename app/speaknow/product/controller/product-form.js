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
                };
                $scope.productImage = null;
                $scope.image = null;
                $scope.productName = null;
                $scope.products = [];
                $scope.productNotExist = false;
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
                        if(response.data.length > 0){
                            $scope.productNotExist = false;
                            $scope.productReference = null;
                            $scope.product.name = null;
                            $scope.product.code = null;
                            $scope.products = response.data;
                        } else {
                            notify.warning("Nãa foi encontrado nenhum produto.");
                            $scope.productNotExist = true;
                        }
                    });
                };

                $scope.setProductReference = function (productReference) {
                    $scope.productReference = productReference;
                    $scope.product.name = productReference.name;
                    $scope.product.code = productReference.code;
                    $scope.products = [];
                };

            });
});