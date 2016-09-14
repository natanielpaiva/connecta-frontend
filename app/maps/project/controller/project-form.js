define([
    "connecta.maps",
    "maps/project/service/project-service"
], function (maps) {

    return maps.lazy.controller("ProjectFormController", function ($scope, ProjectService) {

          $scope.callback = function () {
              alert("teste");
          };


    });

});
