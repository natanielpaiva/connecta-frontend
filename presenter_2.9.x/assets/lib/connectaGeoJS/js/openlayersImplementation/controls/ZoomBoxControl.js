define([], function() {

	var ZoomBoxControl = function(configControl) {
		Function.apply(this);

		//Construtor				
		this.__control = new OpenLayers.Control.ZoomBox();

	};

	ZoomBoxControl.prototype = new Function();
	ZoomBoxControl.prototype.construtor = ZoomBoxControl;

	return ZoomBoxControl;


});