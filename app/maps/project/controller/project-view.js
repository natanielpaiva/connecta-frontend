define([
    "connecta.maps",
    "maps/project/storage/basemaps",
    "maps/project/storage/tools",
    "maps/project/directive/menu-carrousel",
    "maps/project/service/project-service"
], function (maps, baseMapsJson, toolsConfig) {

    return maps.lazy.controller("ProjectViewController", function ($scope, ProjectService, $routeParams, $translate) {

        $scope.project = {};
        $scope.basemaps = [];

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
            var toolsSelected = [];
            var promises = [];



            baseMapsJson.baseMaps.forEach(function(item){
                if (data.basemaps.indexOf(item.name) > -1){
                    $scope.basemaps.push(item);
                }
            });

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
            }).catch(console.error.bind(console));

            return data;

        }

    });

});
