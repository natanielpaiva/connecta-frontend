define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ModalInstanceCtrl',
            function ($scope, $uibModalInstance, ViewerService, $filter, $routeParams) {


                $scope.ok = function () {
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.selectedTemplateType = {};

                ViewerService.getTemplates().then(function (response) {
                    $scope.templates = $filter('orderBy')(response.data, 'id');
                });


                if ($routeParams.analysis) {
                    $scope.analysis = "analysis/" + $routeParams.analysis;
                }

            });
});
