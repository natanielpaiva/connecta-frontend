/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/click-out',
    'portal/layout/service/util'
], function (portal) {
    return portal.lazy.directive('clickOut', function ($clickOutManager, util, $timeout) {
        return {
            restrict: 'A',
            scope: {
                clickOut: '&',
                clickOutExceptions: '='
            },
            controller:function($scope, $element){
		$scope.__uuid = util.uuid();

		var _clickOut = function(){
	           $timeout(function(){
                       $scope.clickOut();
                   });
                };

		$clickOutManager.addListener($scope.__uuid, {
                    exceptions: $scope.clickOutExceptions,
                    scope: $scope,
	            element: $element,
                    onClickOut:_clickOut
		});

                $element.on('$destroy', function(){
                    $clickOutManager.removeListener($scope.__uuid);
                });
            }
        };
    });
});
