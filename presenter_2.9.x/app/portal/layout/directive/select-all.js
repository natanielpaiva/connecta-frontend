define([
    'connecta.portal'
], function (portal) {
    return portal.directive('selectAll', function () {
        return {
            scope: {
                selectAll: '=',
                selectAllProperty: '@',
                ngModel: '='
            },
            controller: function ($scope) {
                $scope.$watch('ngModel', function () {
                    angular.forEach($scope.selectAll, function(item){
                        item[ $scope.selectAllProperty ] = $scope.ngModel;
                    });
                });
            }
        };
    });
});
