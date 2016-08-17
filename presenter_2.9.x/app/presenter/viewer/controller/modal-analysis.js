define([
    'connecta.presenter',
    'presenter/viewer/service/viewer-service'
], function (presenter) {
    return presenter.lazy.controller('ModalAnalysis', function ($scope, $uibModalInstance, analysisResult) {


        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.analysisResult = analysisResult;
       
    });
});
