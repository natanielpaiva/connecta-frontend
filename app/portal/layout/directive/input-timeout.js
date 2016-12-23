define([
    'connecta.portal'
], function (portal) {
    return portal.directive('inputTimeout', function ($timeout) {
        return {
            restrict: 'A',
            scope: {
                onInputTimeout: '&',
                inputTimeoutDelay: '=',
                inputTimeoutIsLoading: '=',
                model: '=ngModel'
            },
            link: function (scope) {
                var _promise = null;

                var _cancelPromise = function () {
                    $timeout.cancel(_promise);
                };

                scope.$watch('model', function (newValue, oldValue) {
                    if (oldValue !== newValue) {
                        scope.inputTimeoutIsLoading = true;
                        _cancelPromise();
                        _promise = $timeout(function () {
                            scope.onInputTimeout(newValue);
                            scope.inputTimeoutIsLoading = false;
                        }, scope.inputTimeoutDelay);
                    }
                });
            }
        };
    });
});

