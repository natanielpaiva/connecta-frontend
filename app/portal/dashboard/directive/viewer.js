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
                edit:'=?',
                showHeader:'=?'
            },
            controller: function ($rootScope, $scope, $http, util) {
                $scope.uuid = util.uuid();

                var expand = function() {
                    if($scope.model.expand) {
                        $scope.model.expand = false;
                        $scope.$emit('dashboard.hasExpanded', false);
                    } else {
                        $scope.model.expand = true;
                        $scope.$emit('dashboard.hasExpanded', true);
                    }
                };

                if ( $scope.src ) {
                    $http.get($scope.src).then(function(response){
                        $scope.model = response.data;
                        $scope.model.expand = false;
                        $scope.model.doExpand = expand;
                        $rootScope.$broadcast('validatePublicDashboard');
                        if ($scope.type && !$scope.model.type) {
                            $scope.model.type = $scope.type;
                        }
                    }, function(error){
                        $rootScope.$broadcast('invalidatePublicDashboard');
                    });
                } else {
                    $scope.model.expand = false;
                    $scope.model.doExpand = expand;
                }
            }
        };
    });
});
