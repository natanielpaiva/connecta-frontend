define([
    'connecta.presenter',
    'presenter/singlesource/service/singlesource-service'
], function (presenter) {
    return presenter.lazy.controller('SingleSourceViewController', function ($scope, SingleSourceService, $routeParams, $location, fileExtensions) {

        SingleSourceService.getById($routeParams.id).then(function (response) {

            $scope.singlesource = response.data;
            $scope.fileExtensions = "";
            if( $scope.singlesource.fileType !== undefined ){
                $scope.fileExtensions = fileExtensions[$scope.singlesource.fileType];
            }
            $scope.singlesource.binaryFile = SingleSourceService.getFileById($routeParams.id);
            
            $scope.excluir = function (id) {
            SingleSourceService.excluir(id).then(function (response) {
                     $location.path('presenter/singlesource');
            }, function (response) {
                
            });
        };
        });

    });
});