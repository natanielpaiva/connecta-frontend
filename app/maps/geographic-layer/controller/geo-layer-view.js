define([
    "connecta.maps",
    "maps/geographic-layer/service/geo-layer-service"
], function (maps) {

    return maps.lazy.controller("GeoLayerViewController", function ($scope, $routeParams,GeoLayerService) {

        var id;

        init();

        function init() {

            id = $routeParams.id;

            getLayer();

        }

        function getLayer() {

            GeoLayerService.get(id).then(onSuccess, onError);

            function onSuccess(response) {
                $scope.layer = response.data;
            }

            function onError(err) {
                throw Error(err);
            }

        }

    });

});
