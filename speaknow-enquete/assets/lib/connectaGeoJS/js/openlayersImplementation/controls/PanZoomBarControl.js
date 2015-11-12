define([], function() {

	var PanZoomBarControl = function() {
		Function.apply(this);

		//Construtor
		this.__control = new OpenLayers.Control.PanZoomBar();

	};

	PanZoomBarControl.prototype = new Function();
	PanZoomBarControl.prototype.construtor = PanZoomBarControl;

	return PanZoomBarControl;


});