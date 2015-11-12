define([
    'connecta.presenter',
    'presenter/hierarchy/service/hierarchy-service'
], function (presenter) {
    return presenter.lazy.controller('HierarchyViewController', function ($scope, HierarchyService, $routeParams) {

        HierarchyService.getById($routeParams.id).then(function(res){
            $scope.hierarchy = res.data;
        });
        
        
        $scope.getSubitems = function (scope, item) {
            scope.toggle();
            return HierarchyService.getItems(item.id).then(function (response) {
                        var ItemOrfao = response.data;
                        if (ItemOrfao !== null) {
                            for (var i in ItemOrfao) {
                                ItemOrfao[i].idParent = item.id;
                            }
                        }
                        item.hierarchyItem = ItemOrfao;
                        scope.toggle();
                    });
        };

    });
});