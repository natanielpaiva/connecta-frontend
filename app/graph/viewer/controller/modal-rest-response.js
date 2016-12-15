define([
    'connecta.graph',
    'graph/viewer/service/viewer-service'
], function (graph) {
    return graph.lazy.controller('ModalResponse', function ($scope, $uibModalInstance, response) {


        $scope.ok = function () {
            $uibModalInstance.close();
        };

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        
        $scope.response = response;
       
    });
});
