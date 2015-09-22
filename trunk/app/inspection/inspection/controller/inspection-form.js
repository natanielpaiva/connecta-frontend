define([
    'connecta.inspection',
    'inspection/inspection/service/inspection-service',
    'inspection/client/service/client-service',
    'inspection/product-item/service/product-item-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (inspection) {
    return inspection.lazy.controller('InspectionFormController', function (
            $scope, InspectionService, notify, $routeParams, $translate, $location,
            $modalTranslate, ClientService, ProductItemService, $modal) {

        $scope.inspection = {};
        $scope.prevDocuments = [];
        $scope.contDocuments = [];
        $scope.standards = [];
        $scope.clients = [];
        $scope.products = [];

        if ($routeParams.id) {
            InspectionService.get($routeParams.id).success(function (data) {
                $scope.isEditing = true;
                $scope.inspection = data;
            });
        }

        ClientService.list().success(function (data) {
            $scope.clients = data;
        });
        
        ProductItemService.list().success(function (data) {
            $scope.products = data;
        });

        $scope.submit = function () {
            InspectionService.save($scope.project, $scope.files).then(function () {
                $translate('INSPECTION.SAVE_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('inspection');
                });
            }, function (response) {
            });
        };

        $scope.openModalProduct = function (product) {

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: "app/inspection/inspection/template/product-form.html",
                controller: function ($scope, InspectionService) {
                    
                    $scope.product = product;
                    $scope.save = function () {
                        modalInstance.dismiss();
                    };

                    $scope.cancel = function () {
                        modalInstance.dismiss();
                    };
                }
            });

        };

    });
});