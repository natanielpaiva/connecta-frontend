define([
    'connecta.maps',
    'maps/applied-budget/service/applied-budget-service',
    'maps/applied-budget/service/connecta-geo-service',
    'maps/municipal-budget/service/municipal-budget-service',
    'maps/budget-area-application/service/budget-area-application-service',
    'portal/layout/service/notify',
    'portal/layout/service/modalTranslate'
], function (maps) {
    return maps.lazy.controller('AppliedBudgetFormController', function ($scope, AppliedBudgetService, ConnectaGeoServiceAppliedBudget, MunicipalBudgetService, BudgetAreaApplicationService, notify, $location, $routeParams, $translate, $http, $modalTranslate) {
        $scope.appliedBudget = null;
        $scope.isEditing = false;
        $scope.municipalBudgets = null;
        $scope.budgetAreaApplications = null;

        //translate buttons text
        $scope.buttonsText = {
            clear: "BUTTON_CLEAR",
            locate: "BUTTON_LOCATE",
            select: "BUTTON_SELECT",
            delete: "BUTTON_DELETE",
            drag: "BUTTON_DRAG",
            initialView:"BUTTON_INITIAL_VIEW"
        };

        $modalTranslate($scope.buttonsText, 'clear', 'APPLIEDBUDGET.BUTTON_CLEAR');
        $modalTranslate($scope.buttonsText, 'locate', 'APPLIEDBUDGET.BUTTON_LOCATE');
        $modalTranslate($scope.buttonsText, 'select', 'APPLIEDBUDGET.BUTTON_SELECT');
        $modalTranslate($scope.buttonsText, 'delete', 'APPLIEDBUDGET.BUTTON_DELETE');
        $modalTranslate($scope.buttonsText, 'drag', 'APPLIEDBUDGET.BUTTON_DRAG');
        $modalTranslate($scope.buttonsText, 'initialView', 'APPLIEDBUDGET.BUTTON_INITIAL_VIEW');


        //Define variável para comparação se mudou de form
        $translate('APPLIEDBUDGET.EDIT').then(function (text) {
            $scope.editText = text;
        });



        MunicipalBudgetService.list().then(function (response) {
            $scope.municipalBudgets = response.data;
        }, function (response) {
            console.info("error", response);
        });


        BudgetAreaApplicationService.list().then(function (response) {
            $scope.budgetAreaApplications = response.data;
        }, function (response) {
            console.info("error", response);
        });


        if ($routeParams.id) {

            $scope.isEditing = true;

            AppliedBudgetService.get($routeParams.id).success(function (data) {
                $scope.appliedBudget = data;               
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


                var interval = setInterval(function () {
                    if (typeof $scope.formulario !=='undefined' && $scope.formulario.description.$viewValue !== "") {
                        //angular.element("#municipalBudget").find("option[label='" + $scope.appliedBudget.municipalBudget.elementName + "']").attr('selected', 'true');
                        angular.element("#budgetAreaApplication").find("option[label='" + $scope.appliedBudget.budgetApplicationArea.description + "']").attr('selected', 'true');
                        angular.element("#budgetAreaApplication").trigger('change');
                        angular.element("#municipalBudget").find("option[label='" + $scope.appliedBudget.municipalBudget.programName + '----> ' + $scope.appliedBudget.municipalBudget.activityProjectName + "']").attr('selected', 'true');
                        angular.element("#municipalBudget").trigger('change');
                        clearInterval(interval);
                    }

                }, 50);


                var int2 = setInterval(function () {
                    //if (angular.element('.row.ng-scope:first>div>h3').text() == "Editar Camada") {
                    if (angular.element('.row.ng-scope:first>div>h3').text() === $scope.editText) {
                        ConnectaGeoServiceAppliedBudget.createMap();

                        var interval2 = setInterval(function () {
                            if ((typeof ConnectaGeoServiceAppliedBudget.map !== 'undefined' && ConnectaGeoServiceAppliedBudget.map !== null) && ConnectaGeoServiceAppliedBudget.map.__objLayers.length > 0) {
                                ConnectaGeoServiceAppliedBudget.addMarker(featurePoint);
                                clearInterval(interval2);
                            }
                        }, 500);

                        clearInterval(int2);
                    }

                }, 50);

            });
        } else {
            ConnectaGeoServiceAppliedBudget.createMap();
        }


        $scope.zoomMapToFullExtent = function () {
            ConnectaGeoServiceAppliedBudget.zoomMapToInitialView();
        };


        $scope.addedMarkers = function () {
            if (ConnectaGeoServiceAppliedBudget.map !== null && ConnectaGeoServiceAppliedBudget.hasmarkers() > 0) {
                return false;
            } else {
                return true;
            }
        };



        $scope.clearAddress = function () {
            angular.element('#searchAddress').val('');
        };


        $scope.geocodeAddress = function () {
            AppliedBudgetService.geocode($scope.searchAddress, $scope);

            var interval = setInterval(function () {
                if (typeof $scope.geocodedObject != 'undefined') {
                    if ($scope.geocodedObject.status === "OK") {

                        $translate('APPLIEDBUDGET.GEOCODE_SUCCESS').then(function (msgSuccess) {
                            notify.info(msgSuccess);
                        });
                        $scope.addMarker($scope.geocodedObject.results[0]);
                        $scope.formulario.description.$setViewValue($scope.formulario.description.$viewValue);
                    } else {
                        $translate('APPLIEDBUDGET.GEOCODE_ZERO_RESULTS').then(function (msgZeroResults) {
                            notify.info(msgZeroResults);
                        });
                    }
                    clearInterval(interval);
                }
            });

        };


        $scope.addMarker = function (object) {
            var latitude = object.geometry.location.lat;
            var longitude = object.geometry.location.lng;

            var featurePoint = {
                type: 'Point',
                x: longitude,
                y: latitude,
                featureStyle: {
                    externalGraphic: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
                    graphicWidth: 25,
                    graphicHeight: 25,
                    fillOpacity: 1
                }
            };

            ConnectaGeoServiceAppliedBudget.addMarker(featurePoint);
        };



        $scope.toggleDragControl = function () {
            ConnectaGeoServiceAppliedBudget.toggleDragMarker();
        };


        $scope.toggleDrawMarker = function () {
            ConnectaGeoServiceAppliedBudget.toggleDrawMarker();
        };



        $scope.removeMarkers = function () {
            ConnectaGeoServiceAppliedBudget.removeMarkers();
        };



        $scope.submit = function () {
            $scope.appliedBudget.geomWKT = ConnectaGeoServiceAppliedBudget.getMarkerWKT();
            $scope.appliedBudget.municipalBudget = {"id": $scope.appliedBudget.municipalBudget.id};
            $scope.appliedBudget.budgetAreaApplication = {"id": $scope.appliedBudget.budgetAreaApplication.id};
            AppliedBudgetService.save($scope.appliedBudget).then(function () {
                $translate('APPLIEDBUDGET.ADDED_SUCCESS').then(function (text) {
                    notify.success(text);
                    $location.path('maps/applied-budget');
                });
            }, function (response) {
                notify.error(response);
            });
        };

    });
});