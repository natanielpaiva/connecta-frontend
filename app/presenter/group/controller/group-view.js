define([
    'connecta.presenter',
    'presenter/group/service/group-service'
], function (presenter) {
    return presenter.lazy.controller('GroupViewController', function ($scope, GroupService, $routeParams, $location, fileExtensions) {

        GroupService.getById($routeParams.id).then(function (response) {

            $scope.group = response.data;

            GroupService.getGroupBySingleSourceId($scope.group.id)
                    .then(function (response) {
                        var singleSourceGroup = response.data.singleSourceGroup;
                        $scope.group.singleSource = [];
                        for (var indice in singleSourceGroup) {
                            $scope.group.singleSource[singleSourceGroup[indice].numOrder] = {};
                            $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                    .path = GroupService.getFileById(
                                            singleSourceGroup[indice].singleSource.id);

                            $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                    .name = singleSourceGroup[indice].singleSource.name;

                            $scope.group.singleSource[singleSourceGroup[indice].numOrder]
                                    .fileType = fileExtensions[singleSourceGroup[indice]
                                            .singleSource.fileType].fileType;

                        }

                    }, function (response) {
                        console.log(response);
                    });

            $scope.excluir = function (id) {
                GroupService.delete(id).then(function (response) {
                    $location.path('presenter/group');
                }, function (response) {

                });
            };
        });

    });
});