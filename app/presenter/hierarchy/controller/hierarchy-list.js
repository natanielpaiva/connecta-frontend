define([
    'connecta.presenter',
    'presenter/hierarchy/service/hierarchy-service'
], function (presenter) {
    return presenter.lazy.controller('HierarchyListController', function ($scope, HierarchyService) {

       $scope.hierarchy = null;
       HierarchyService.list().then(function(response){
           $scope.hierarchy = response.data;
       });
       
       $scope.excluir = function(id){
           HierarchyService.excluir(id).then(function(response){
               $scope.hierarchy.splice(
                $scope.hierarchy.indexOf(id), 1
                );
           });
       };
       
    });
});