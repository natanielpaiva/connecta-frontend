define(['openlayersImplementation/openlayers-api/OpenLayers-2.13.1/lib/OpenLayers/Control/Swipe'], function(Swipe) {

	var SwipeControl = function(configSwipe) {
		Function.apply(this);

		//OBJ do MAPA
		this.__objMap = configSwipe.MAP;

		this.__mapDivId = this.__objMap.__map.div.id;

		this.__control = new OpenLayers.Control.Swipe(this.__objMap.__getLayerByName(configSwipe.layerName).__layerObj.__layer, this.__objMap.__getLayerByName(configSwipe.layerName2).__layerObj.__layer);


		this.__control.events.on({
			"activate": this.__showSwipeBar.bind(this),
			"deactivate": this.__hideSwipeBar.bind(this)
		});



		//Cria DIV estilizar o efeito de 'linha' no mapa
		this.__element = document.createElement('div');
		this.__element.id = "divisionSwipe";
		//Nome do mapa
		document.getElementById(this.__mapDivId).appendChild(this.__element);
		//Estilizando a DIV
		this.__element.style.left = "0px";
		this.__element.style.top = "0px";
		this.__element.style.position = "absolute";
		this.__element.style.height = "100%";
		this.__element.style.zIndex = "99999";
		this.__element.style.background = "black";
		this.__element.style.width = "1px";
		this.__element.style.boxShadow = "0px 0px 3px black";


	};

	SwipeControl.prototype = new Function();
	SwipeControl.prototype.construtor = SwipeControl;

	/**
	 * [__setLayer Altera camada a ser utilizada pelo controle de Swipe]
	 * @param  {[String]} layerName [Nome da Layer a ser utilizada]
	 * @param  {[String]} layerName2 [Nome da Layer a ser utilizada]
	 */
	SwipeControl.prototype.__setLayer = function(layerName, layerName2) {
		this.__control.deactivate();
		this.__control = new OpenLayers.Control.Swipe(this.__objMap.__getLayerByName(layerName).__layerObj.__layer, this.__objMap.__getLayerByName(layerName2).__layerObj.__layer);

	};


	/**
	 * [__showSwipeBar Exibe a barra de Swipe]
	 */
	SwipeControl.prototype.__showSwipeBar = function() {

		this.__element.style.display = "";

	};


	/**
	 * [__hideSwipeBar Esconde  a barra de Swipe]
	 */
	SwipeControl.prototype.__hideSwipeBar = function() {

		this.__element.style.display = "none";

	};



	return SwipeControl;

});