define([], function() {

	var ScaleLineControl = function() {
		Function.apply(this);

		//Construtor
		this.__control = new OpenLayers.Control.ScaleLine();

	};

	ScaleLineControl.prototype = new Function();
	ScaleLineControl.prototype.construtor = ScaleLineControl;

	return ScaleLineControl;


});