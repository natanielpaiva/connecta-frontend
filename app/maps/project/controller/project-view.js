define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/tools",
    "maps/project/directive/menu-carrousel",
    "maps/project/service/project-service"
], function (maps, baseMapsJson, toolsConfig) {

    return maps.lazy.controller("ProjectViewController", function ($scope, ProjectService, $routeParams, $translate) {

        $scope.project = {};

        $scope.widgets = [];

        if ($routeParams.id) {
            try {
                var promise = ProjectService.get($routeParams.id);
                promise.then(function (response) {
                    console.info(response.data);
                    $scope.project = prepareProject(response.data);
                });
            } catch (error) {

            }
        }

        $scope.delete = function (id) {
            try {
                var promise = ProjectService.delete(id);
                promise.then(function () {
                    notify.info("Item deletado");
                });

            } catch (error) {

            }
        };

        function prepareProject(data) {
            var promises = [];
            var basemaps = [];

            baseMapsJson.baseMaps.forEach(function(item){
                if (data.basemaps.indexOf(item.name) > -1){
                    basemaps.push(item);
                }
            });

            $scope.basemaps = basemaps;

            toolsConfig.tools.forEach(function(item){
                for(var l in data.tools){
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

    });

});
