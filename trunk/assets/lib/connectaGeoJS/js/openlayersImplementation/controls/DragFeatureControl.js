define([], function() {

	var DragFeatureControl = function(configDragFeature) {
		Function.apply(this);

		//Construtor
		this.__control = new OpenLayers.Control.DragFeature(configDragFeature.MAP.__getLayerByName(configDragFeature.layerName).__layerObj.__layer);

	};

	DragFeatureControl.prototype = new Function();
	DragFeatureControl.prototype.construtor = DragFeatureControl;

	return DragFeatureControl;


});