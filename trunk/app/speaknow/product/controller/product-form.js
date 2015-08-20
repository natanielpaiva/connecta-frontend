define([
    'connecta.speaknow',
    'speaknow/product/service/product-service',
    'portal/layout/service/notify'
], function (speaknow) {
    return speaknow.lazy.controller('ProductForm',
            function ($scope, $routeParams, $location, ProductService, notify, $translate, speaknowResources) {

                $scope.product = {
                    name: "",
                    code: "",
                    type: "",
                    productReference: null,
                    image: speaknowResources.base + "/product/image/"
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
                        $scope.isEdit = true;
                        $scope.product = data;
                        $scope.product.demand = $scope.product.demand.toString();
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
                    if ($scope.newProductReference && $scope.product.code) {
                        $scope.product.productReference.name = $scope.product.name;
                    }
                    if ($scope.productImage === null && !$scope.isEdit) {
                        notify.warning("Cadastre uma imagem para o Produto");
                        return null;
                    }
                    ProductService.save($scope.product, $scope.productImage).then(function (data) {
                        if (data.data === "") {
                            notify.warning("Código de barras já cadastrado, forneça um código de barras não cadastrado.");
                            return null;
                        }
                        $translate('PRODUCT.SAVE_SUCCESS').then(function (text) {
                            notify.success(text);
                            $location.path('speaknow/product');
                        });
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
                        $scope.reset();
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
                    $scope.product.name = productReference.name;
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

                $scope.showForm = function () {
                    var isService = $scope.product.type == 'SERVICE';
                    var isNewOrReferenceExists = $scope.newProductReference || $scope.product.productReference !== null;
                    var isProduct = $scope.product.type == 'PRODUCT';
                    return isService || (isNewOrReferenceExists && isProduct);
                };

                $scope.reset = function () {
                    $scope.newProductReference = null;
                    $scope.product.productReference = null;
                    $scope.product.name = null;
                };

            });
});
