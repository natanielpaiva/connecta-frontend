define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Marker'], function(Marker) {

	var MarkerLayer = function(configLayer) {
		Function.apply(this);

		//Construtor

		this.__objMarkers = [];

		this.__layer = new OpenLayers.Layer.Markers(configLayer.name);
		this.__objMap = configLayer.MAP;

	};

	MarkerLayer.prototype = new Function();
	MarkerLayer.prototype.construtor = MarkerLayer;



	/**
	 * [__createMarker Cria Marker]
	 * @param  {[JSON]} config [Config do Marker a ser criado ]
	 */
	MarkerLayer.prototype.__createMarker = function(config) {
		config['MAP'] = this.__objMap;
		var marker = new Marker(config);
		this.__addMarker(marker.__marker);

	};



	/**
	 * [__addMarker Adiciona Marker]
	 * @param  {[JSON]} marker [Marker]
	 */
	MarkerLayer.prototype.__addMarker = function(marker) {
		this.__layer.addMarker(marker);
		this.__objMarkers.push(marker);

	};


	/**
	 * [__removeMarker Remove Marker]
	 * @param  {[JSON]} marker [Marker]
	 */
	MarkerLayer.prototype.__removeMarker = function(marker) {		
		this.__layer.removeMarker(marker);
		var index = this.__objMarkers.indexOf(marker);
		this.__objMarkers.splice(index, 1);

	};



	/**
	 * [__removeMarker Remove todas os Markers]	 
	 */	
	MarkerLayer.prototype.__removeAllMarkers = function() {		
		this.__layer.clearMarkers();
		this.__objMarkers = [];

	};



	return MarkerLayer;


});