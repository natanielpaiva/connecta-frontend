/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('clickOut', function ($window) {
        return {
            restrict: 'A',
            scope: {
                clickOut: '&',
                clickOutExceptions: '='
            },
            link: function (scope, element) {
                function _getElements(){
                    var _elements = [
                        element[0]
                    ];

                    scope.clickOutExceptions.forEach(function(exception){
                        _elements.push(angular.element(exception).get(0));
                    });
                    
                    return _elements;
                }
                
                angular.element($window).on('click', function (event) {
                    var els = _getElements().filter(function(el){
                        return el && el.contains(event.target);
                    });
                    if (els.length === 0) {
                        scope.clickOut();
                        scope.$apply();
                    }
                });
            }
        };
    });
});
