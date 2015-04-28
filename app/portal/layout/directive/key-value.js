define([
    'connecta.portal',
    'portal/layout/directive/key-value-item'
], function(portal){
    return portal.directive('keyValue', function(){
        return {
            restrict:'AE',
            templateUrl: "app/portal/layout/directive/template/key-value.html",
            transclude: true,
            scope:{
                $model:'=ngModel'
            },
            controller:function($scope) {
                $scope.keyValueAddItem = function(){
                    $scope.$model.push({});
                };
                $scope.keyValueRemoveItem = function($item) {
                    $scope.$model.splice(
                        $scope.$model.indexOf($item), 1
                    );
                };
            }
        };
    });
});