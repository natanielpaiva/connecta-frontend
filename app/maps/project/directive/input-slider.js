define([
    "connecta.maps"
], function (maps) {

    function InputSlider ($scope) {
        var self = this;
        var minZoom;
        var maxZoom;

        minZoom = $scope.project.mapConfig.minZoom;
        maxZoom = $scope.project.mapConfig.maxZoom;

        Object.defineProperties($scope.project.mapConfig, {

            minZoom : {
                get : function() {
                    return minZoom;
                },

                set : function(value) {
                    minZoom = value;
                    self.updateZoomConfig('minZoom');
                }
            },

            maxZoom : {
                get : function() {
                    return maxZoom;
                },

                set : function(value) {
                    maxZoom = value;
                    self.updateZoomConfig('maxZoom');
                }
            }
        });

        self.onClickToggleBindZoom = function (param) {
            $scope.toggleZoomBind(param);
        };

        self.updateZoomConfig = function (param) {
            $scope.updateZoomConfig(param);
        };
    }

    return maps.lazy.directive("inputSlider", function ($timeout) {
        return {
            restrict: 'AE',
            templateUrl: 'app/maps/project/directive/template/input-slider.html',
            controllerAs: '$ctrl',
            scope: {
                project : '=',
                configSlider : '=',
                toggleZoomBind : '=',
                updateZoomConfig : '='
            },
            link : function (scope) {
                $timeout(function () {
                    scope.$broadcast('rzSliderForceRender');
                });
            },
            controller : InputSlider
        };
    });
});
