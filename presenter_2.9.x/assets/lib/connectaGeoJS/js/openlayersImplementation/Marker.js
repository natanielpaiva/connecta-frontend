define([], function() {

	var Marker = function(configMarker) {
		Function.apply(this);

		//Construtor                    
		//console.info("CONFIGMARKER", configMarker);

		var size = new OpenLayers.Size(configMarker.size.width, configMarker.size.height);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var icon = new OpenLayers.Icon(configMarker.iconURL, size, offset);

		this.__marker = new OpenLayers.Marker(new OpenLayers.LonLat(configMarker.coords.x, configMarker.coords.y).transform("EPSG:4326", configMarker.MAP.__map.getProjection()), icon);
	};


	Marker.prototype = new Function();
	Marker.prototype.construtor = Marker;

	return Marker;
});