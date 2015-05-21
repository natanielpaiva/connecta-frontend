define([], function() {

	var Feature = function(configVectorFeature) {
		Function.apply(this);

		//Construtor                    
		//console.info("CONFIGFEATURE", configVectorFeature);
		this["__create" + configVectorFeature.type + "Feature"](configVectorFeature);


	};

	Feature.prototype = new Function();
	Feature.prototype.construtor = Feature;

	/**
	 * [__createPointFeature Criar feature do tipo point]
	 * @param  {[JSON]} config [Config do objeto a ser criado]
	 */
	Feature.prototype.__createPointFeature = function(config) {

		var point = new OpenLayers.Geometry.Point(config.x, config.y).transform('EPSG:4326', config.MAP.__map.getProjection());
		this.__feature = new OpenLayers.Feature.Vector(point, null);

		if (typeof config.featureStyle != 'undefined')
			this.__feature.style = config.featureStyle;

	};


	/**
	 * [__createLineFeature Criar feature do tipo line]
	 * @param  {[JSON]} config [Config do objeto a ser criado]
	 */
	Feature.prototype.__createLineFeature = function(config) {
		var point, linePoints = [];

		for (var objPoint in config.points) {

			point = new OpenLayers.Geometry.Point(config.points[objPoint].x, config.points[objPoint].y).transform('EPSG:4326', config.MAP.__map.getProjection());
			linePoints.push(point);
		}

		this.__feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(linePoints));

		if (typeof config.featureStyle != 'undefined')
			this.__feature.style = config.featureStyle;
	};


	/**
	 * [__createPolygonFeature Criar feature do tipo polygon]
	 * @param  {[JSON]} config [Config do objeto a ser criado]
	 */
	Feature.prototype.__createPolygonFeature = function(config) {
		console.log("config", config);
		var point, polygonPoints = [];

		for (var objPoint in config.points) {
			point = new OpenLayers.Geometry.Point(config.points[objPoint].x, config.points[objPoint].y).transform('EPSG:4326', config.MAP.__map.getProjection());
			polygonPoints.push(point);
		}

		var ring = new OpenLayers.Geometry.LinearRing(polygonPoints);
		this.__feature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([ring]));

		if (typeof config.featureStyle != 'undefined')
			this.__feature.style = config.featureStyle;

	};


	return Feature;

});