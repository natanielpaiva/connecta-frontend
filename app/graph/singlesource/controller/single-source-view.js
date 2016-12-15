define([
    'connecta.graph',
    'graph/singlesource/service/singlesource-service'
], function (graph) {
    return graph.lazy.controller('SingleSourceViewController', function ($scope, SingleSourceService, $routeParams, $location, fileExtensions) {

        SingleSourceService.getById($routeParams.id).then(function (response) {

            $scope.singlesource = response.data;
            $scope.fileExtensions = "";
            if ($scope.singlesource.fileType !== undefined) {
                $scope.fileExtensions = fileExtensions[$scope.singlesource.fileType];
            }
            $scope.singlesource.binaryFile = SingleSourceService.getFileById($routeParams.id);
            
            $scope.getType = function(){
                return SingleSourceService.getTypesArray().filter(function(type){
                    return type.id == $scope.singlesource.type;
                }).pop();
            };

            $scope.excluir = function(id){
                SingleSourceService.delete(id).then(function(){
                    $location.path('graph/singlesource');
                });
            };
        });

    });
});