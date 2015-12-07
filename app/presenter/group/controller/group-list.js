define([
    'connecta.presenter',
    'presenter/group/service/group-service'
], function (presenter) {
    return presenter.lazy.controller('GroupListController', function ($scope, GroupService, ngTableParams) {

        $scope.filter = false;

        $scope.groups = [];
        
        $scope.types = GroupService.getTypes();
        
        $scope.tableParams = new ngTableParams({
            count:50,
            page:1,
            filter: $scope.filter
        }, {
            getData: function ($defer, params) {
                return GroupService.list(params.url()).then(function(response){
                    $scope.groups = response.data;
                });
            },
            counts:[50,100,150,200]
        });
        
        $scope.bulkRemove = function (groups) {
            GroupService.bulkRemove(groups).then(function(){
                angular.forEach(groups, function(group){
                    $scope.groups.splice(
                        $scope.groups.indexOf(group), 1);
                });
            });
        };
        
    });
});