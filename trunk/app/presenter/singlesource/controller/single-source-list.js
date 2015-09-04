define([
    'connecta.presenter',
    'presenter/singlesource/service/singlesource-service'
], function (presenter) {
    return presenter.lazy.controller('SingleSourceListController', function ($scope, SingleSourceService, fileExtensions) {
        $scope.types = SingleSourceService.getTypes();

        $scope.filter = false;

        $scope.singlesource = null;
        SingleSourceService.list().then(function (response) {
            $scope.singlesource = response.data;
            //console.log(response.data);
        }, function (response) {
            //console.log(response);
        });

         
        $scope.excluir = function (singlesource) {
            SingleSourceService.delete(singlesource.id).then(function () {
                var index = $scope.singlesource.indexOf(singlesource);
                $scope.singlesource.splice(index, 1);
            });
        };
    });
});