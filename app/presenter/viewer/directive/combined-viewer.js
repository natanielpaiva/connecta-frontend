define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('combinedViewer', function() {
        return {
            templateUrl: 'app/presenter/viewer/directive/template/combined-viewer.html',
            scope:{
                model:'=?ngModel',
                src:'=?'
            },
            controller: function ($scope, $http) {
                if ( $scope.src ) {
                    $http.get($scope.src).then(function(response){
                        $scope.model = response.data;
                    });
                }
            }
        };
    });
});
