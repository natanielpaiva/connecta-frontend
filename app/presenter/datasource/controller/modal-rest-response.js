define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ModalResponse', function ($scope, $uibModalInstance, response) {


        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.response = response;
       
    });
});
