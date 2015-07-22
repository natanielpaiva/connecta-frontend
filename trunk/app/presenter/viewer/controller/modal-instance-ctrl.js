define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ModalInstanceCtrl', function ($scope, $modalInstance, ViewerService) {


        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        ViewerService.getTemplates().then(function (response) {
            $scope.templates = response.data;
        });

    });
});
