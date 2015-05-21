define(['openlayersImplementation/Layer', 'openlayersImplementation/Feature'], function(Layer, Feature) {

    var MeasureControl = function(config) {
        Function.apply(this);

        //Construtor        
        var configVectorLayer = {
            type: 'Vector',
            title: 'Layer para exibição de distâncias',
            name: 'MeasureLayer',
            MAP: config.MAP
        };

        this.__measureLayer = new Layer(configVectorLayer);

        // style the sketch fancy
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "white",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#666666",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#666666",
                fillColor: "white",
                fillOpacity: 0.3
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({
                symbolizer: sketchSymbolizers
            })
        ]);
        var styleMap = new OpenLayers.StyleMap({
            "default": style
        });

        // allow testing of specific renderers via "?renderer=Canvas", etc
        var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;


        this.__control = new OpenLayers.Control.Measure(
            OpenLayers.Handler.Path, {
                persist: true,
                handlerOptions: {
                    layerOptions: {
                        renderers: renderer,
                        styleMap: styleMap
                    }
                }
            }
        );


        this.__control.events.on({
            "measure": this.__showMeasure.bind(this),
            "measurepartial": this.__showMeasure.bind(this),
            "activate": this.__activateMeasureControl.bind(this),
            "deactivate": this.__deactivateMeasureControl.bind(this)
        });


        //OBJ do MAPA
        this.__objMap = config.MAP;

    };

    MeasureControl.prototype = new Function();
    MeasureControl.prototype.construtor = MeasureControl;



    /**
     * [__activateMeasureControl Adiciona camada das distâncias ao mapa]
     */
    MeasureControl.prototype.__activateMeasureControl = function() {
        this.__objMap.__addLayer(this.__measureLayer);

    };


    /**
     * [__deactivateMeasureControl Remove camada das distâncias do mapa]
     */
    MeasureControl.prototype.__deactivateMeasureControl = function() {
        this.__measureLayer.__layerObj.__removeAllFeatures();
        this.__objMap.__removeLayer(this.__measureLayer);
    };



    /**
     * [__showMeasure Exibe a distância no mapa]
     * @param  {[JSON]} event [Evento do controle de measure do Openlayers ]
     */
    MeasureControl.prototype.__showMeasure = function(event) {    

        if (this.lastEventType && this.lastEventType === 'measure') {
            this.__measureLayer.__layerObj.__removeAllFeatures();
        }


        this.lastEventType = event.type;

        var Style = {
            strokeWidth: 0,
            strokeLinecap: 'square',
            fillOpacity: 0.6,
            pointRadius: 35,
            fillColor: '#000080',
            label: (event.measure.toFixed(2) + " " + event.units),
            fontColor: 'white',
            fontSize: '10px',
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            labelAlign: 'cm'
        };

        var ponto = event.geometry.getVertices().pop().transform('EPSG:3857', 'EPSG:4326');
        var point = {
            type: 'Point',
            x: ponto.x,
            y: ponto.y,
            featureStyle: Style
        };


        this.__measureLayer.__layerObj.__createFeature(point);

        //  console.info("LAYER SHOW MEASURE", this.__measureLayer);

        this.__measureLayer.__layerObj.__layer.redraw();

    };


    return MeasureControl;


});