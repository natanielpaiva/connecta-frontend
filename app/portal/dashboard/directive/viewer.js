define([
    'connecta.portal',
    'portal/layout/service/util'
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
            controller: function ($rootScope, $scope, $http, util) {
                $scope.uuid = util.uuid();
                if ( $scope.src ) {
                    $http.get($scope.src).then(function(response){
                        $scope.model = response.data;
                        $rootScope.$broadcast('validatePublicDashboard');
                        if ($scope.type && !$scope.model.type) {
                            $scope.model.type = $scope.type;
                        }
                    }, function(error){
                        $rootScope.$broadcast('invalidatePublicDashboard');
                    });
                }
            }
        };
    });
});