define([], function() {

	var SelectFeatureControl = function(configSelectFeature) {
		Function.apply(this);

		//Construtor                    
	//	console.info("CONFIGLEGEND", configSelectFeature);

		this.__control = new OpenLayers.Control.SelectFeature([configSelectFeature.MAP.__getLayerByName(configSelectFeature.layerName).__layerObj.__layer]);

	};

	SelectFeatureControl.prototype = new Function();
	SelectFeatureControl.prototype.construtor = SelectFeatureControl;

	return SelectFeatureControl;

});