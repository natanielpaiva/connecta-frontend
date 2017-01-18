define([ConnectaGeoConfig.baseURL+'AbstractLayer',ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/WMSLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/VectorLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/MarkerLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/BoxLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/ClusterLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/HeatMapLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/ArcGISLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/MapviewerLayer',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/layers/MapserverLayer'
], function(AbstractLayer,WMSLayer, VectorLayer, MarkerLayer, BoxLayer, ClusterLayer, HeatMapLayer, ArcGISLayer,MapviewerLayer,MapserverLayer) {

	var Layer = function(configLayer) {
		Function.apply(this);

		//Construtor
		//Chama método para criar camada
		this.__objMap = configLayer.MAP;
		this.__createLayer(configLayer);


	};

	Layer.prototype = new AbstractLayer();
	Layer.prototype.construtor = Layer;

	Layer.prototype.__createLayer = function(configLayer) {
		var layerName = eval(configLayer.type + "Layer");
		this.__layerObj = new layerName(configLayer);
		this.__layerObj["layerName"] = configLayer.name;

	};

	Layer.prototype.__getLayerVisibility = function() {

		return this.__layerObj.__layer.getVisibility();		

	};

	Layer.prototype.__setLayerVisibility = function(visibility) {

		this.__layerObj.__layer.setVisibility(visibility);
		//reordenar as camadas
		this.__objMap.__map.raiseLayer(this.__layerObj.__layer, this.__objMap.__map.layers.length);

		if (typeof this.__layerObj.__legend != 'undefined') {
			this.__layerObj.__setLegendVisibility(visibility);
		}



	};


	Layer.prototype.__setLayerOpacity = function(opacity) {

		this.__layerObj.__layer.setOpacity(opacity);

	};


	Layer.prototype.__setLayerFilter = function(query) {

		if (this.__layerObj.__layer.CLASS_NAME == "OpenLayers.Layer.WMS") {
			this.__layerObj.__setCQLFILTER(query);
		}

	};

	Layer.prototype.__removeLayerFilter = function() {

		if (this.__layerObj.__layer.CLASS_NAME == "OpenLayers.Layer.WMS") {
			delete this.__layerObj.__layer.params.CQL_FILTER
			this.__layerObj.__layer.redraw();
		}

	};


	return Layer;

});