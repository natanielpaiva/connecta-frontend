define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/tools",
    "maps/helper/map",
    "maps/project/directive/menu-carrousel",
    "maps/project/service/project-service",
], function (maps, baseMapsJson, toolsConfig, mapHelper) {

    return maps.lazy.controller("ProjectViewController", function ($scope, ProjectService, $routeParams, $translate, $location, notify) {

        $scope.project = {};

        $scope.widgets = [];

        init();

        function init() {
            loadProject();
        }

        function loadProject() {
            if ($routeParams.id) {
                try {
                    var promise = ProjectService.get($routeParams.id);
                    promise.then(function (response) {
                        $scope.project = prepareProject(response.data);
                        var timer = setInterval(function () {
                            if (mapHelper.map) {
                                var zoomConfig = $scope.project.mapConfig;
                                mapHelper.map.setView(zoomConfig.center, zoomConfig.zoom);
                                mapHelper.freezeCurrentBounds();
                                clearInterval(timer);
                            }
                        }, 100);
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }

        $scope.delete = function (id) {
            try {
                var promise = ProjectService.delete(id);
                promise.then(function () {
                    $location.path("/maps/project");
                    notify.info("PROJECT.DELETE_SUCCESS");
                });

            } catch (error) {
                console.error(error);
            }
        };

        function prepareProject(data) {
            var promises = [];
            var basemaps = [];

            baseMapsJson.baseMaps.forEach(function (item) {
                if (data.basemaps.indexOf(item.name) > -1) {
                    basemaps.push(item);
                }
            });

            $scope.basemaps = basemaps;

            toolsConfig.tools.forEach(function (item) {
                for (var l in data.tools) {
                    if (data.tools[l].active && item.model === data.tools[l].name) {
                        promises.push($translate(item.title));
                        break;
                    }
                }
            });

            Promise.all(promises).then(function (labels) {
                $scope.listTools = labels.join(', ');
                $scope.$apply();
            }).catch(console.error.bind(console));

            for (var index in data.widgets) {
                $scope.widgets.push(toolsConfig.widgets[index].title);
            }

            $scope.widgets = $scope.widgets.join(", ");

            return data;

        }

        $scope.initMap = function () {
            setTimeout(function () {
                var promise = mapHelper.buildMap('_mapDivProjectView', {attributionControl: false, zoomControl: false});
                promise.catch(function (err) {
                    notify.error(err.statusText);
                });
                promise.then(function (map) {
                    //
                });
            }, 10);
        };

    });

});
