define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('viewer', function() {
        return {
            templateUrl: 'app/portal/dashboard/directive/template/viewer.html',
            scope:{
                model:'=?ngModel',
                src:'=?',
                type:'=?',
                edit:'=?'
            },
            controller: function ($scope, $http) {
                if ( $scope.src ) {
                    $http.get($scope.src).then(function(response){
                        $scope.model = response.data;
                        if ($scope.type && !$scope.model.type) {
                            $scope.model.type = $scope.type;
                        }
                    });
                }
            }
        };
    });
});