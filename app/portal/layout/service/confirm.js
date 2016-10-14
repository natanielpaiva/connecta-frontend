/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.factory('$confirm', function ($modal, $q) {
        return function(title, content){
            var deferred = $q.defer();

            var modal = $modal.open({
                animation: true,
                templateUrl: 'app/portal/layout/directive/template/confirm.html',
                controller: function($scope){
                  $scope.title = title;
                  $scope.content = content;

                  $scope.ok = function(){
                    deferred.resolve();
                    modal.close();
                  };

                  $scope.cancel = function(){
                    deferred.reject();
                    modal.close();
                  };
                },
                size: 'sm'
            });

            return deferred.promise;
        };
    });
});
