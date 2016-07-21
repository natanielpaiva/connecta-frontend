/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.directive('clickOut', function ($window, $timeout) {
        return {
            restrict: 'A',
            scope: {
                clickOut: '&',
                clickOutExceptions: '='
            },
            link: function (scope, element) {
                var _element = element[0];
                
                function _getElements(){
                    var _elements = [];

                    scope.clickOutExceptions.forEach(function(exception){
                        _elements.push(angular.element(exception).get(0));
                    });
                    
                    return _elements;
                }
                
                angular.element($window).on('click', function (event) {
                    var els = _getElements().filter(function(el){
                        return el && el.contains(event.target);
                    });
                    if (!_element.contains(event.target) && els.length === 0) {
                        $timeout(function(){
                            scope.clickOut();
                        });
                    }
                });
            }
        };
    });
});
