define([
    'connecta.maps'    
], function (maps) {
    return maps.lazy.service('ToolBarService', function (mapsResources, $http) {

        this.map = "";

        this.setMap = function (Map) {
            this.map = Map;
        };


        this.zoomMapToMaxExtent = function () {
            this.map.__zoomMapToMaxExtent();
        };

        this.toggleZoomArea = function () {
            var control = this.map.__getControlByName("ZoomBox");
            if (control.__controlObj.__control.active === null || !control.__controlObj.__control.active) {
                control.__activateControl();

            } else {
                control.__deactivateControl();
            }
        };


        this.changeBaseMap = function (baseMap) {
            this.map.__switchBaseLayer(baseMap);
        };

        this.changeLayerOpacity = function (opacity) {
            this.map.__objLayers[0].__setLayerOpacity(opacity);
        };

        this.toggleInfo = function () {
            var control = this.map.__getControlByName("WMSInfo");
            if (control.__controlObj.__control.active === null || !control.__controlObj.__control.active) {
                control.__activateControl();
            } else {
                control.__deactivateControl();
            }
        };


        this.toggleSpatialFilter = function (filterType) {
            var control = this.map.__getControlByName("SpatialFilter");
            if (filterType !== "") {
                if (control.__controlObj.__ObjFilterType === filterType && control.__controlObj.__control.active !== null) {
                    control.__deactivateControl();
                } else {
                    control.__controlObj.__switchFiltertype(filterType);
                    control.__activateControl();

                }
            } else {
                control.__controlObj.__removeSpatialFilter();
                if (control.__controlObj.__control.active) {
                    control.__deactivateControl();
                }
            }
        };


        this.toggleLegend = function () {
            angular.element("#" + this.map.__objLayers[0].__layerObj.__legend.__imgLegend).toggle();
        };

    });

});