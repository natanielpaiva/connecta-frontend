define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('ToolBarService', function (mapsResources, $http) {

        this.map = "";

        this.setMap = function (Map) {
            this.map = Map;
            mapp = this.map;
        };

        this.zoomMapToMaxExtent = function () {
            this.map.__zoomMapToMaxExtent();
        };
        
        this.setLayerOpacity = function (layer, opacity) {
            console.log("layer",layer);
            console.log("opacity",opacity);
            this.map.__getLayerByName(layer).__setLayerOpacity(opacity);
        };

        this.toggleZoomArea = function () {
            var control = this.map.__getControlByName("ZoomBox");
            if (control.__controlObj.__control.active === null || !control.__controlObj.__control.active) {
                control.__activateControl();

            } else {
                control.__deactivateControl();
            }
        };

        this.toggleInfo = function () {
            var control = this.map.__getControlByName("WMSInfo");
            if (control.__controlObj.__control.active === null || !control.__controlObj.__control.active) {
                control.__activateControl();
            } else {
                control.__deactivateControl();
            }
        };

        this.activateSwipe = function (layer1, layer2) {
            var control = this.map.__getControlByName("Swipe Control");
            console.log("control swipe", control);

            control.__controlObj.__setLayer(layer1, layer2);
            control.__activateControl();
            //aparece com a linha de divisao da funcionalidade
            angular.element("#divisionSwipe").css("display","");
        };
        this.deactivateSwipe = function () {
            var control = this.map.__getControlByName("Swipe Control");

            control.__deactivateControl();
            //desaparece com a linha de divisao da funcionalidade
            angular.element("#divisionSwipe").css("display","none");
        };
        
        this.layerVisibility = function(layerName, visibility) {
            this.map.__getLayerByName(layerName).__setLayerVisibility(visibility);
        };        
    });

});