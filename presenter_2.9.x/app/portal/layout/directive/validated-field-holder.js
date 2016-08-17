define([
    'connecta.portal'
], function (portal) {
    return portal.directive('validatedFieldHolder', function () {
        return {
            restrict: 'A',
            scope: {
                field:'=validatedFieldHolder'
            },
            link:function(scope, element) {
                scope.element = element;
            },
            controller:function($scope){
                var changeHandler = function(value){
                    if ($scope.field && $scope.field.$invalid && $scope.field.$touched) {
                        $scope.element.addClass('has-error');
                    } else {
                        $scope.element.removeClass('has-error');
                    }
                };
                
                $scope.$watch('field.$invalid', changeHandler);
                $scope.$watch('field.$touched', changeHandler);
            }
        };
    });
});