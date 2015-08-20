define([], function() {

	var Box = function(configBox) {
		Function.apply(this);


		//Construtor                    
		//console.info("CONFIGBOX", configBox);
		var bounds = new OpenLayers.Bounds(configBox.point1.x, configBox.point1.y, configBox.point2.x, configBox.point2.y).transform("EPSG:4326", configBox.MAP.__map.getProjection());
		this.__box = new OpenLayers.Marker.Box(bounds);

	};

	Box.prototype = new Function();
	Box.prototype.construtor = Box;

	/**
	 * [__setBoxContent Define conteúdo HTML para o marcador de BOX]
	 * @param  {[HTML]} contentHTML [conteúdo em formato HTML]	 
	 */
	Box.prototype.__setBoxContent = function(contentHTML) {

		this.__box.div.innerHTML = contentHTML;

	};

	return Box;
});