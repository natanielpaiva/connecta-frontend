define([], function() {

	var ArcGISLayer = function(configLayer) {
		Function.apply(this);

		//Construtor							
		this.__layer = new OpenLayers.Layer.ArcGIS93Rest(configLayer.title,
			configLayer.serverUrl, {				
				layers: "show:"+configLayer.layers,
				transparent: true
			}, {
				isBaseLayer: false,
				displayInLayerSwitcher: false
			});				

	};

	ArcGISLayer.prototype = new Function();
	ArcGISLayer.prototype.construtor = ArcGISLayer;


	return ArcGISLayer;

});