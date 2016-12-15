define([
    'connecta.graph',
    'graph/datasource/service/datasource-service'
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
