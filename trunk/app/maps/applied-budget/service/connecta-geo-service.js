define([
    'connecta.maps',
    'bower_components/connectaGeoJS/index/ConnectaGeoJS',
    'bower_components/connectaGeoJS/index/maps_config',
    'bower_components/connectaGeoJS/index/require_config',
    'maps/applied-budget/service/map-service'
], function (maps, connectaGeoJS, mapsConfig) {
    return maps.lazy.service('ConnectaGeoService', function (mapsResources, $http, MapService) {

        //Bse URL Framework
        mapsConfig.baseURL = "bower_components/connectaGeoJS/index/";
        mapsConfig.proxyURLOpenlayers = mapsResources.openlayersProxy;
        //mapsConfig.proxyURLOpenlayers = "http://localhost:7001/connecta-maps/proxy.jsp?";

        this.__connectaGeo = new connectaGeoJS();
        MapService.setConnectaGeo(this.__connectaGeo);

        this.map = null;
        this.controlAddMarker = null;


        this.createMap = function () {

            if (this.__connectaGeo.__objMaps.length > 0) {
                this.__connectaGeo.__destroyObjMap(this.__connectaGeo.__objMaps[0]);
                delete MapService.map;
            }

            //Openlayers
            MapService.createMap(1);
            var that = this;

            var interval = setInterval(function () {
                if (typeof MapService.map !== 'undefined') {
                    that.map = MapService.map;
                    var layerVector = {
                        type: 'Vector',
                        title: 'Layer de TESTE VECTOR a partir de outra camada',
                        name: 'VECTOR',
                        useSourceLayer: false};
                    that.map.__createLayer(layerVector);
                    that.map.__createControl(that.__connectaGeo.__mapsConfig.Openlayers.Controls.controlDragFeature);

                    //controle para retornar posição do mapa
                    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                        defaultHandlerOptions: {
                            'single': true,
                            'double': false,
                            'pixelTolerance': 0,
                            'stopSingle': false,
                            'stopDouble': false
                        },
                        initialize: function (options) {
                            this.handlerOptions = OpenLayers.Util.extend(
                                    {}, this.defaultHandlerOptions
                                    );
                            OpenLayers.Control.prototype.initialize.apply(
                                    this, arguments
                                    );
                            this.handler = new OpenLayers.Handler.Click(
                                    this, {
                                        'click': this.trigger
                                    }, this.handlerOptions
                                    );
                        },
                        trigger: function (e) {


                            var lonlat = that.map.__map.getLonLatFromViewPortPx(e.xy).transform('EPSG:900913', "EPSG:4326");

                            var featurePoint = {
                                type: 'Point',
                                x: lonlat.lon,
                                y: lonlat.lat,
                                featureStyle: {
                                    externalGraphic: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png",
                                    graphicWidth: 25,
                                    graphicHeight: 25,
                                    fillOpacity: 1
                                }};

                            that.addMarker(featurePoint);

                        }
                    });


                    this.controlAddMarker = new OpenLayers.Control.Click();
                    that.map.__map.addControl(this.controlAddMarker);

                    clearInterval(interval);
                }

            });
        };


        this.initControl = function (controlName) {

            if (controlName === "drawMarker") {
                //DragControl                
                angular.element('#btn_dragMarker').css('background-color', '');
                var control = this.map.__getControlByName("DragFeature");
                if (control.__controlObj.__control.active) {
                    control.__controlObj.__control.deactivate();
                }
            } else {
                angular.element('#btn_drawMarker').css('background-color', '');
            }


        };


        this.toggleDrawMarker = function () {
            this.initControl('drawMarker');

            if (this.controlAddMarker === null) {
                this.controlAddMarker = this.map.__map.controls[1];
            }

            if (this.controlAddMarker.active === null || !this.controlAddMarker.active) {
                angular.element('#btn_drawMarker').css('background-color', 'rgba(0,0,32,0.8)');
                this.controlAddMarker.activate();

            } else {
                angular.element('#btn_drawMarker').css('background-color', '');
                this.controlAddMarker.deactivate();
            }
        };

        this.toggleDragMarker = function () {
            this.initControl('dragMarker');
            var control = this.map.__getControlByName("DragFeature");
            if (control.__controlObj.__control.active === null || !control.__controlObj.__control.active) {
                angular.element('#btn_dragMarker').css('background-color', 'rgba(0,0,32,0.8)');
                control.__activateControl();

            } else {
                angular.element('#btn_dragMarker').css('background-color', '');
                control.__deactivateControl();
            }
        };


        this.zoomMapToInitialView = function () {
            var mapCenter = {
                point: {
                    x: -46.57081,
                    y: -23.691020
                }
            };
            this.map.__setMapCenter(mapCenter);
            this.map.__map.zoomTo(6);
        };


        this.addMarker = function (config) {
            var layer = this.map.__getLayerByName("VECTOR");
            if (layer.__layerObj.__layer.features.length > 0) {
                this.removeMarkers();
            }

            layer.__layerObj.__createFeature(config);
            var center = {
                point: {
                    x: config.x,
                    y: config.y
                },
                zoom: 16
            };

            this.map.__setMapCenter(center);
        };


        this.removeMarkers = function () {
            var layer = this.map.__getLayerByName("VECTOR");
            layer.__layerObj.__removeAllFeatures();
        };


        this.hasmarkers = function () {
            var layer = this.map.__getLayerByName("VECTOR");
            return layer.__layerObj.__layer.features.length;
        };


        this.getMarkerWKT = function () {
            var layer = this.map.__getLayerByName("VECTOR");
            var feature = layer.__layerObj.__layer.features[0];
            feature.geometry.transform("EPSG:900913", "EPSG:4326");
            var wkt = new OpenLayers.Format.WKT();
            var str = wkt.write(feature);
            // not a good idea in general, just for this demo
            str = str.replace(/,/g, ', ');
            return str;

        };



    });
});
