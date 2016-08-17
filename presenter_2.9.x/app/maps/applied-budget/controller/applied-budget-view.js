define([
    'connecta.maps',
    'maps/applied-budget/service/applied-budget-service',
    'maps/applied-budget/service/connecta-geo-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('AppliedBudgetViewController', function ($scope, AppliedBudgetService, ConnectaGeoServiceAppliedBudget, notify, $routeParams, $location, $modalTranslate, $translate) {


        AppliedBudgetService.get($routeParams.id).then(function (response) {
            $scope.appliedBudget = response.data;

            var longitude = $scope.appliedBudget.geomWKT.substring(6, $scope.appliedBudget.geomWKT.indexOf(" "));
            var latitude = $scope.appliedBudget.geomWKT.substring($scope.appliedBudget.geomWKT.indexOf(" ") + 1, $scope.appliedBudget.geomWKT.indexOf(")"));


            var featurePoint = {
                type: 'Point',
                x: longitude,
                y: latitude,
                featureStyle: {
                    externalGraphic: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
                    graphicWidth: 25,
                    graphicHeight: 25,
                    fillOpacity: 1
                }};



            ConnectaGeoServiceAppliedBudget.createMap();
            var interval2 = setInterval(function () {
                if ((typeof ConnectaGeoServiceAppliedBudget.map !== 'undefined' && ConnectaGeoServiceAppliedBudget.map !== null) && ConnectaGeoServiceAppliedBudget.map.__objLayers.length > 0) {

                    ConnectaGeoServiceAppliedBudget.addMarker(featurePoint);
                    clearInterval(interval2);
                }
            }, 500);
            
            
            

            $scope.remove = function (id) {
                AppliedBudgetService.delete(id).then(function () {
                    $translate('APPLIEDBUDGET.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/applied-budget');
                    });
                }, function (response) {
                    $translate('APPLIEDBUDGET.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/applied-budget');
                    });
                });
            };


            //Parâmetros da Modal
            $scope.modalParams = {
                title: "",
                text: "",
                size: 'sm',
                success: $scope.remove
            };

            //translate das propriedades da modal
            $modalTranslate($scope.modalParams, 'title', 'APPLIEDBUDGET.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'APPLIEDBUDGET.CONFIRM_DELETE');
        });

    });
});