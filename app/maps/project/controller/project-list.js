define([
    "connecta.maps",
    "maps/project/service/project-service"
], function (maps) {

    return maps.lazy.controller("ProjectListController", function ($scope, ProjectService) {

        init();

        function init() {

            getAllProjects();

        }

        function getAllProjects () {

            var promise = ProjectService.list();

            promise.then(onSuccess, onError);

            function onSuccess (response) {

                $scope.projects = response.data;

            }

            function onError (err) {

               throw Error(err);

            }

        }
    });

});
