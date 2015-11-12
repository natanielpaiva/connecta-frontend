define([], function() {

	var DeleteFeatureControl = function(configDeleteFeature) {
		Function.apply(this);

		//Construtor                    	

		var featureLayer = configDeleteFeature.MAP.__getLayerByName(configDeleteFeature.layerName).__layerObj.__layer;
		var opt_deleteFeatureControl = {
			click: true,
			onSelect: function(feature) {
				var id = feature.id;
				var feature = featureLayer.getFeatureById(id);				
				feature.state = OpenLayers.State.DELETE;
				featureLayer.events.triggerEvent("afterfeaturemodified", {
					feature: feature
				});
				feature.renderIntent = "select";
				featureLayer.drawFeature(feature);
			}
		};


		this.__control = new OpenLayers.Control.SelectFeature(featureLayer, opt_deleteFeatureControl);

	};

	DeleteFeatureControl.prototype = new Function();
	DeleteFeatureControl.prototype.construtor = DeleteFeatureControl;

	return DeleteFeatureControl;

});