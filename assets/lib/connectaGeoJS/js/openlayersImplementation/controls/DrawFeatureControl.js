define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Layer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/openlayers-api/OpenLayers-2.13.1/lib/OpenLayers/Control/Snapping',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/openlayers-api/OpenLayers-2.13.1/lib/OpenLayers/Control/Trace'
], function(Layer, Snapping, Trace) {

	var DrawFeatureControl = function(configDrawFeature) {
		Function.apply(this);

		//Construtor

		var configDrawLayer = {
			type: 'Vector',
			title: 'Layer para desenho de features',
			name: 'DrawLayer',
			MAP: configDrawFeature.MAP
		};


		//OBJ do MAPA
		this.__objMap = configDrawFeature.MAP;

		this.__layerName = configDrawFeature.layerName;

		this.__drawLayer = (this.__layerName != "") ? this.__objMap.__getLayerByName(this.__layerName) : new Layer(configDrawLayer);


		this["__createDraw" + configDrawFeature.drawType + "Control"](this.__drawLayer.__layerObj.__layer);


		// configure the snapping agent
		this.__snappingControl = new OpenLayers.Control.Snapping({
			layer: this.__drawLayer.__layerObj.__layer,
			targets: [{
				layer: this.__drawLayer.__layerObj.__layer
			}]
		});


		// configure the trace agent
		this.__tracingControl = new OpenLayers.Control.Trace(this.__snappingControl, {});



		this.__control.events.on({
			"activate": this.__activateDrawControl.bind(this),
			"deactivate": this.__deactivateDrawControl.bind(this)
		});

	};

	DrawFeatureControl.prototype = new Function();
	DrawFeatureControl.prototype.construtor = DrawFeatureControl;


	/**
	 * [__activateDrawControl Adiciona camada de desenho ao mapa]
	 */
	DrawFeatureControl.prototype.__activateDrawControl = function() {
		if (this.__layerName == '') {
			this.__objMap.__addLayer(this.__drawLayer);
		}

	};


	/**
	 * [__deactivateDrawControl Remove camada de desenho do mapa]
	 */
	DrawFeatureControl.prototype.__deactivateDrawControl = function() {
		if (this.__layerName == '') {
			this.__disableSnapping();
			this.__drawLayer.__layerObj.__removeAllFeatures();
			this.__objMap.__removeLayer(this.__drawLayer);
		}
	};


	/**
	 * [__prepareJSON Controle para desenho de pontos]
	 * @param  {[OpenLayers.Layer.Vector]} drawLayer [Layer de vetor ]
	 */
	DrawFeatureControl.prototype.__createDrawPointControl = function(drawLayer) {
		this.__control = new OpenLayers.Control.DrawFeature(
			drawLayer, OpenLayers.Handler.Point
		);

	};


	/**
	 * [__createDrawLineControl Controle para desenho de linhas]
	 * @param  {[OpenLayers.Layer.Vector]} drawLayer [Layer de vetor ]
	 */
	DrawFeatureControl.prototype.__createDrawLineControl = function(drawLayer) {
		this.__control = new OpenLayers.Control.DrawFeature(
			drawLayer, OpenLayers.Handler.Path
		);

	};



	/**
	 * [__createDrawPolygonControl Controle para desenho de polígonos]
	 * @param  {[OpenLayers.Layer.Vector]} drawLayer [Layer de vetor ]
	 */
	DrawFeatureControl.prototype.__createDrawPolygonControl = function(drawLayer) {
		this.__control = new OpenLayers.Control.DrawFeature(
			drawLayer, OpenLayers.Handler.Polygon
		);

	};


	/**
	 * [__createDrawBoxControl Controle para desenho de retângulos]
	 * @param  {[OpenLayers.Layer.Vector]} drawLayer [Layer de vetor ]
	 */
	DrawFeatureControl.prototype.__createDrawBoxControl = function(drawLayer) {

		this.__control = new OpenLayers.Control.DrawFeature(drawLayer,
			OpenLayers.Handler.RegularPolygon, {
				handlerOptions: {
					sides: 4,
					irregular: true,
					multi: true
				}
			});

	};



	/**
	 * [__createDrawSquareControl Controle para desenho de quadrados]
	 * @param  {[OpenLayers.Layer.Vector]} drawLayer [Layer de vetor ]
	 */
	DrawFeatureControl.prototype.__createDrawSquareControl = function(drawLayer) {
		this.__control = new OpenLayers.Control.DrawFeature(
			drawLayer,
			OpenLayers.Handler.RegularPolygon, {
				handlerOptions: {
					sides: 4,
					irregular: true,
					persist: true
				}
			}
		);

	};


	/**
	 * [__enableSnapping Habilita snapping para o controle de Desenho]
	 */
	DrawFeatureControl.prototype.__enableSnapping = function() {
		this.__snappingControl.activate();
	};


	/**
	 * [__disableSnapping Desabilita snapping para o controle de Desenho]
	 */
	DrawFeatureControl.prototype.__disableSnapping = function() {
		this.__snappingControl.deactivate();
	};


	/**
	 * [__enableTracing Habilita tracing para o controle de Desenho]
	 */
	DrawFeatureControl.prototype.__enableTracing = function() {
		//Verifica se o controle de snapping está ativo
		if (!this.__snappingControl.active) {
			this.__enableSnapping();
		}

		this.__tracingControl.activate();
	};


	/**
	 * [__disableTracing Desabilita tracing para o controle de Desenho]
	 */
	DrawFeatureControl.prototype.__disableTracing = function() {
		this.__tracingControl.deactivate();
	};



	return DrawFeatureControl;

});