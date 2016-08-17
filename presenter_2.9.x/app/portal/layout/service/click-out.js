/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.service('$clickOutManager', function ($window, $timeout) {
        var $clickOutManager = this;

        var _listenerMap = {};

        $clickOutManager.addListener = function (id, options) {
            _listenerMap[ id ] = options;
        };

        $clickOutManager.removeListener = function (id) {
            delete _listenerMap[ id ];
        };

        function _getElements(listener) {
            var _elements = [];

            if (listener.exceptions) {
                listener.exceptions.forEach(function (exception) {
                    _elements.push(angular.element(exception).get(0));
                });
            }

            return _elements;
        }

        angular.element($window).on('click', function (event) {
            for (var i in _listenerMap) {
                /* jshint loopfunc: true */
                var listener = _listenerMap[i];
                var els = _getElements(listener).filter(function(el){
                    return el && el.contains(event.target);
                });

                if (!listener.element[0].contains(event.target) && els.length === 0) {
                    listener.onClickOut();
                }
            }
        });
    });
});

