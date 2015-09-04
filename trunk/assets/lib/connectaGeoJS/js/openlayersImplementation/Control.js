define([ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/ZoomBoxControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/WMSInfoControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/SelectFeatureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/DrawFeatureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/ModifyFeatureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/DeleteFeatureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/DragFeatureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/LayerSwitcherControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/OverviewMapControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/PanZoomBarControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/ScaleLineControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/MeasureControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/GeoLocationControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/NavigationHistoryControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/SpatialFilterControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/RouteControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/SwipeControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/MouseCoordsControl',
    ConnectaGeoConfig.baseURL + 'openlayersImplementation/controls/InfoFeatureControl'
], function (ZoomBoxControl, WMSInfoControl, SelectFeatureControl, DrawFeatureControl, ModifyFeatureControl,
        DeleteFeatureControl, DragFeatureControl, LayerSwitcherControl, OverviewMapControl, PanZoomBarControl,
        ScaleLineControl, MeasureControl, GeoLocationControl, NavigationHistoryControl, SpatialFilterControl,
        RouteControl, SwipeControl, MouseCoordsControl, InfoFeatureControl
        ) {

    var Control = function (configControl) {
        Function.apply(this);

        //Construtor                    
        //console.info("CONFIGCONTROl", configControl);
        this.__objMap = configControl.MAP;
        //this["__create" + configControl.type + "Control"](configControl);
        //Chama método para criar controle
        this.__createControl(configControl);

    };

    Control.prototype = new Function();
    Control.prototype.construtor = Control;


    /**
     * [__createControl Criar Controle de acordo com o tipo]
     * @param  {[JSON]} config [config do controle a ser criado]
     */
    Control.prototype.__createControl = function (config) {

        var controlName = eval(config.type + "Control");
        this.__controlObj = new controlName(config);
        this.__controlObj["controlName"] = config.name;
    };

    /**
     * [__activateControl Ativa o controle]
     */
    Control.prototype.__activateControl = function () {

        this.__objMap.__deactivateControls();
        this.__controlObj.__control.activate();


    };

    /**
     * [__deactivateControl Desativa o controle]
     */
    Control.prototype.__deactivateControl = function () {

        this.__controlObj.__control.deactivate();

    };


    return Control;

});