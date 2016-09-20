define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/steps",
    'maps/project/helper/map-helper',
    "maps/project/service/project-service",
    'maps/project/directive/menu-carrousel'
], function (maps, baseMapsConfig, stepsConfig, mapHelper) {

    return maps.lazy.controller("ProjectFormController", function ($scope) {

        const WatcherEnum = {
            MAP_CENTER: 'mapCenter',
            MAX_ZOOM: 'maxZoom',
            MIN_ZOOM: 'minZoom',
            INITIAL_ZOOM: 'initialZoom'
        };

        $scope.watchers = {};

        $scope.zoomConfig = {
          min: 1,
          max: 10
        };

        $scope.currentWatcher = undefined;

        $scope.mapInit = function () {
          mapHelper.buildMap('_mapDiv', [37.75, -122.23], 10)
            .catch(function (error) {
              console.error(error);
            })
            .then(function (map) {
              $scope.mapCenter = mapHelper.getCenter();
              $scope.$apply();
              $scope.watchers[WatcherEnum.MAP_CENTER] = mapHelper.watchCenterChange(function (position) {
                $scope.mapCenter = position;
                $scope.$apply();
              }, true);

              $scope.watchers[WatcherEnum.MIN_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                $scope.zoomConfig.min = zoom;
                $scope.$apply();
              }, true);

              $scope.watchers[WatcherEnum.MAX_ZOOM] = mapHelper.watchZoomChange(function (zoom) {
                $scope.zoomConfig.max = zoom;
                $scope.$apply();
              }, true);

            });
        };

        $scope.setCurrentWatcher = function (watcher) {
          if (watcher === $scope.currentWatcher) {
            $scope.watchers[$scope.currentWatcher].pause();
            $scope.currentWatcher = undefined;
          } else {
            if (watcher === WatcherEnum.MAP_CENTER) {
              mapHelper.setCenter($scope.mapCenter);
            }
            if (watcher === WatcherEnum.MAX_ZOOM) {
              mapHelper.setZoom($scope.zoomConfig.max);
            }
            if (watcher === WatcherEnum.MIN_ZOOM) {
              mapHelper.setZoom($scope.zoomConfig.min);
            }
            $scope.currentWatcher = watcher;
            $scope.watchers[$scope.currentWatcher].resume();
          }
        };

        $scope.updateMaxZoom = function () {
            if ($scope.currentWatcher === WatcherEnum.MAX_ZOOM) {
              mapHelper.setZoom($scope.zoomConfig.max);
            }
        };

        $scope.updateMinZoom = function () {
            if ($scope.currentWatcher === WatcherEnum.MIN_ZOOM) {
              mapHelper.setZoom($scope.zoomConfig.min);
            }
        };

        $scope.updateCenter = function () {
          if ($scope.currentWatcher === WatcherEnum.MAP_CENTER) {
            $scope.watchers[$scope.currentWatcher].pause();
            mapHelper.setCenter($scope.mapCenter);
            $scope.watchers[$scope.currentWatcher].resume();
          }
        };

        $scope.currentStep = 1;

        $scope.steps = stepsConfig;

        $scope.baseMapThumbUrl = 'app/maps/project/template/_project_base_map_thumb.html';

        $scope.baseMaps = baseMapsConfig.baseMaps;

        $scope.changeStep = function (increment) {

            var active = "active",
                disabled = "disabled",
                complete = "complete",
                nextStep;

            if (increment) {
                $scope.steps[$scope.currentStep].style = complete;
                nextStep = $scope.currentStep + 1;
            } else {
                $scope.steps[$scope.currentStep].style = disabled;
                nextStep = $scope.currentStep - 1;
            }

            $scope.steps[nextStep].style = active;
            $scope.currentStep = nextStep;

        };

    });

});
