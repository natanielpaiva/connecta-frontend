define([
    'connecta.presenter',
    'presenter/group/service/group-service'
], function (presenter) {
    return presenter.lazy.controller('GroupListController', function ($scope, GroupService) {
        $scope.types = GroupService.getTypes();

        $scope.filter = false;

        $scope.group = null;
        GroupService.list().then(function (response) {
            $scope.group = response.data;
        }, function (response) {
            console.log(response);
        });


        $scope.excluir = function (group) {
            GroupService.delete(group.id).then(function () {
                var index = $scope.group.indexOf(group);
                $scope.group.splice(index, 1);
            });
        };
    });
});