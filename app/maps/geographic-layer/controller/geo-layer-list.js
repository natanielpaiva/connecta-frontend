define([
    "connecta.maps",
    "maps/geographic-layer/service/geo-layer-service"
], function (maps) {

    return maps.lazy.controller("GeoLayerListController", function ($scope, GeoLayerService) {


        init();

        function init() {

            getAllLayers();

        }

        function getAllLayers () {

            var promise = GeoLayerService.list();

            promise.then(onSuccess, onError);

            function onSuccess(response) {

              $scope.layers = response.data;

            }

            function onError (err) {

              throw new Error(err);

            }

        }






    });

});
