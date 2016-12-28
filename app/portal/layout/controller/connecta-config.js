define([
    'connecta.portal',
    'portal/layout/service/connecta-config-service'
], function(portal) {
    return portal.lazy.controller('ConnectaConfigController', function($scope, ConnectaConfigService, $location) {

        ConnectaConfigService.getJob().then(function(response){
            $scope.quartzJob = response.data;
            $scope.interval = response.data.interval.toString();
        });

        $scope.submit = function(){
            ConnectaConfigService.reschedule($scope.quartzJob, $scope.interval).then(function () {
                $location.path('/');
            });
        };

    });
});
