define([
    'connecta.maps',
    'maps/drill/service/drill-service',
    'maps/drill/service/connecta-geo-service',
    'portal/layout/service/modalTranslate',
    'portal/layout/service/notify'
], function (maps) {
    return maps.lazy.controller('DrillViewController', function ($scope, DrillService, ConnectaGeoServiceDrill, notify, $routeParams, $location, $translate, $modalTranslate) {


        var parentDrillViewer = $scope;


        //Acessar Maps pelo Presenter
        window.mapsScope = parentDrillViewer;
        var hasPresenter = false;

        if (typeof parent.window.app != 'undefined') {
            var interval = setInterval(function () {
                if (angular.element('#map-view-drill').length > 0 && angular.element(".well.margin-top-single.margin-bottom-single").length > 0 && angular.element(".page-container").length > 0) {
                    //Estiliza div para exibição no Presenter 1.0
                    var divMap = document.getElementById('map-view-drill');
                    document.body.appendChild(divMap);
                    divMap.style.height = "100%";
                    divMap.style.width = "100%";
                    divMap.style.position = "absolute";
                    divMap.style.top = 0;
                    angular.element(".page-container").children()[0].remove();
                    angular.element(".page-container").children()[0].remove();
                    angular.element(".page-container").children()[1].remove();
                    angular.element('.connecta-menu').remove();
                    angular.element("#menu-top").remove();
                    angular.element(".well.margin-top-single.margin-bottom-single").children()[0].remove();
                    clearInterval(interval);
                }

            }, 50);
            //Acessar Presenter pelo Maps
            window.presenterApp = parent.window.app;
            hasPresenter = true;
        }



        $scope.actualDrillLevel = 0;

        DrillService.get($routeParams.id).then(function (response) {
            //Cria o Mapa
            ConnectaGeoServiceDrill.createMap();

            var interval = setInterval(function () {
                if (ConnectaGeoServiceDrill.mapCreated) {
                    $scope.addInfoEvent();
                    $scope.mountDrillObject();
                    clearInterval(interval);
                }
            });

            $scope.drill = response.data;


            $scope.remove = function (id) {
                DrillService.delete(id).then(function () {
                    $translate('LAYERVIEWER.REMOVE_SUCCESS').then(function (text) {
                        notify.success(text);
                        $location.path('maps/drill');
                    });
                }, function (response) {
                    $translate('LAYERVIEWER.ERROR_REMOVING').then(function (text) {
                        notify.error(text);
                        $location.path('maps/drill');
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
            $modalTranslate($scope.modalParams, 'title', 'LAYERVIEWER.TITLE_CONFIRM_DELETE');
            $modalTranslate($scope.modalParams, 'text', 'LAYERVIEWER.CONFIRM_DELETE');

        });




        $scope.mountDrillObject = function () {
            //TODO
            //Lógica de Drills e Níveis de Drill
            console.info("DRILL Object", $scope.drill, $scope.drill.drillLevels, $scope.drill.drillLevels[$scope.actualDrillLevel], $scope.drill.drillLevels[$scope.actualDrillLevel].parentViewer);
            $scope.currentDrillLevel = 0;
            if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel] !== 'undefined') {
                $scope.drill.drillLevels[$scope.actualDrillLevel].parentViewer.filter = "";
                ConnectaGeoServiceDrill.showViewer($scope.drill.drillLevels[$scope.actualDrillLevel].parentViewer);
            }

        };



        $scope.addInfoEvent = function () {
            console.info("sadgfdsag", ConnectaGeoServiceDrill);
            var interval = setInterval(function () {
                if (typeof ConnectaGeoServiceDrill.__connectaGeo.__objMaps[0].__getControlByName("WMSInfo") !== 'undefined') {
                    $scope.MAP = ConnectaGeoServiceDrill.__connectaGeo.__objMaps[0];
                    $scope.controlInfo = ConnectaGeoServiceDrill.__connectaGeo.__objMaps[0].__getControlByName("WMSInfo").__controlObj.__control;
                    $scope.controlInfo.events.register("getfeatureinfo", this, $scope.showInfo);
                    clearInterval(interval);
                }
            });
        };


        $scope.showInfo = function (event) {

            console.info("EVENT", event.features[0]);
            if (typeof event.features[0] == "undefined") {
                return false;
            }


            var geometry = event.features[0].geometry;
            var point = geometry.getBounds().getCenterLonLat();
            $scope.configSetCenter = {
                point: {
                    x: point.lon,
                    y: point.lat
                },
                zoom: ($scope.MAP.__map.getZoom() + 2)
            };


            var that = this;

            var infoContent = "<b>Informações da Camada : " + event.features[0].gml.featureType + "</b><br/><br/>";

            //Percorre os atributos da feature para montar o conteúdo da popup
            for (var prop in event.features[0].attributes) {

                //Caso a camada possua como atributo um link , adiciona link para visualizá-lo em uma popup
                if (event.features[0].attributes[prop].indexOf('http://') > -1) {
                    infoContent += "<b>" + prop + " : </b><span onclick=window.open('" + event.features[0].attributes[prop] + "','','width=300,height=300,left=100,top=50');><a href='#'>Visualizar</a></span><br/>";
                } else {

                    infoContent += "<b>" + prop + " : </b>" + event.features[0].attributes[prop] + "<br/>";
                }

            }


//            Verifica se possui drilldown ew Drillup
            if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel] !== 'undefined') {
                var drillDownProp = event.features[0].attributes[$scope.drill.drillLevels[$scope.actualDrillLevel].parentViewerColumn];

                infoContent += "<button id='btn_drillDown'>Drill Down</button> ";
            }


            var drillUpProp = "";
            if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel - 1] !== 'undefined') {
                drillUpProp = event.features[0].attributes[$scope.drill.drillLevels[$scope.actualDrillLevel - 1].childViewerColumn];
                infoContent += "<button id='btn_drillUp'>Drill Up</button> ";
            }

            var popup = ConnectaGeoServiceDrill.addPopup($scope.MAP, infoContent, event.xy);
            $scope.MAP.__map.popups[0].destroy();
            $scope.MAP.__map.addPopup(popup.__popup);
            console.info("POPUPS", $scope.MAP.__map.popups);

            angular.element('#btn_drillDown').click(function () {
                $scope.controlInfo.deactivate();
                $scope.destroyMapPopups();
                $scope.drillDown(drillDownProp);
            });


            angular.element('#btn_drillUp').click(function () {
                $scope.controlInfo.deactivate();
                $scope.destroyMapPopups();
                $scope.drillUp(drillUpProp);
            });
        };

        $scope.destroyMapPopups = function () {
            for (var popup in $scope.MAP.__map.popups) {
                $scope.MAP.__map.popups[popup].destroy();
            }
        };


        $scope.centerMap = function () {
            console.info("CENTER", $scope.MAP, $scope.configSetCenter);
            $scope.MAP.__setMapCenter($scope.configSetCenter);
        };




        $scope.drillDown = function (prop, presenterDrill) {
            console.info("PROP DRILL DPOWN", prop);
            $scope.drill.drillLevels[$scope.actualDrillLevel].childViewer.filter = $scope.drill.drillLevels[$scope.actualDrillLevel].childViewerColumn + "='" + prop.toUpperCase() + "'";
            $scope.MAP.__removeLayer($scope.MAP.__objLayers[0]);
            //$scope.MAP.__objLayers[0].__setLayerVisibility(false);
            console.info("DRIL DOWN VIEWER", $scope.drill.drillLevels[$scope.actualDrillLevel].childViewer);
            ConnectaGeoServiceDrill.showViewer($scope.drill.drillLevels[$scope.actualDrillLevel].childViewer);
            //TODO
            //recriar menu e legenda
            if (hasPresenter && typeof presenterDrill == 'undefined') {
                if (window.presenterApp.ViewerController.analysisColum.indexOf("FFFFFF") > -1) {
                    window.presenterApp.ViewerController.analysisColum.splice(window.presenterApp.ViewerController.analysisColum.indexOf("FFFFFF"), 1);

                }

                window.presenterApp.ViewerController.execDrillDown(prop.toUpperCase(), window.presenterApp.ViewerController.__config.drill.drillLevels[$scope.actualDrillLevel].columnName, true);
            }

            $scope.actualDrillLevel++;
            console.info("DRIIL LEVEL", $scope.actualDrillLevel);
            if (typeof $scope.configSetCenter !== 'undefined') {
                $scope.centerMap();
            }


        };


        $scope.drillUp = function () {
            if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel - 2] !== 'undefined') {
                $scope.drill.drillLevels[$scope.actualDrillLevel - 1].parentViewer.filter = $scope.drill.drillLevels[$scope.actualDrillLevel - 2].childViewer.filter;
            } else if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel - 1] !== 'undefined') {
                //Level 0
                $scope.drill.drillLevels[$scope.actualDrillLevel - 1].parentViewer.filter = "";

            }

            //Remove a camada
            if (typeof $scope.MAP.__objLayers[0] !== 'undefined') {
                $scope.MAP.__removeLayer($scope.MAP.__objLayers[0]);
            }

            //Exibe o Visualizador
            if (typeof $scope.drill.drillLevels[$scope.actualDrillLevel - 1] !== 'undefined') {
                ConnectaGeoServiceDrill.showViewer($scope.drill.drillLevels[$scope.actualDrillLevel - 1].parentViewer);

            }
            $scope.actualDrillLevel--;

            if (hasPresenter && window.presenterApp.ViewerController.nivelDrill > $scope.actualDrillLevel) {
                window.presenterApp.ViewerController.execDrillUp(true);
            }
            console.info("ZOOM LEVEL", $scope.actualDrillLevel);
            if (typeof $scope.configSetCenter !== 'undefined' && $scope.actualDrillLevel > 0) {
                $scope.configSetCenter.zoom = parseInt($scope.configSetCenter.zoom - 4);
                $scope.centerMap();

            } else {
                $scope.MAP.__zoomMapToMaxExtent();
            }
        };


    });
});