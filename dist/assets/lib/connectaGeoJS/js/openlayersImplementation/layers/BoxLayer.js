define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Box'], function(Box) {

	var BoxLayer = function(configLayer) {
		Function.apply(this);

		//Construtor

		//console.info("BOX LAYER CONFIG", configLayer);

		this.__objBoxes = [];

		this.__layer = new OpenLayers.Layer.Boxes(configLayer.name);

		this.__objMap = configLayer.MAP;

	};

	BoxLayer.prototype = new Function();
	BoxLayer.prototype.construtor = BoxLayer;


	/**
	 * [__createBoxMarker Criar Marker Box]
	 * @param  {[JSON]} config [Config do Marcador de Box a ser criado ]
	 */
	BoxLayer.prototype.__createBoxMarker = function(config) {
		config['MAP'] = this.__objMap;
		var box = new Box(config);
		this.__addBoxMarker(box);

	};



	/**
	 * [__addBoxMarker Adiciona Marker Box]
	 * @param  {[OpenLayers.Markers.Box]} box [Box ]
	 */
	BoxLayer.prototype.__addBoxMarker = function(box) {
		this.__layer.drawMarker(box.__box);
		this.__objBoxes.push(box);

	};



	/**
	 * [__removeBoxMarker Remove Marker Box]
	 * @param  {[OpenLayers.Markers.Box]} box [Box ]
	 */
	BoxLayer.prototype.__removeBoxMarker = function(box) {
		this.__layer.removeMarker(box.__box);
		var index = this.__objBoxes.indexOf(box);
		this.__objBoxes.splice(index, 1);

	};


	/**
	 * [__removeAllBoxesMarkers Remove todos os Markers Boxes]	 
	 */	
	BoxLayer.prototype.__removeAllBoxesMarkers = function() {
		for (var box in this.__objBoxes) {
			this.__removeBoxMarker(this.__objBoxes[box]);
		}

	};

	return BoxLayer;

});