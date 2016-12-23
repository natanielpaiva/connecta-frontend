define([], function() {

	var LayerSwitcherControl = function() {
		Function.apply(this);

		//Construtor
		this.__control = new OpenLayers.Control.LayerSwitcher();		

	};

	LayerSwitcherControl.prototype = new Function();
	LayerSwitcherControl.prototype.construtor = LayerSwitcherControl;

	return LayerSwitcherControl;


});