define([], function() {

	var Popup = function(map, content, xy) {
		Function.apply(this);

		//Construtor                    		
		this.__popupMap = map.__getMap();

		this.__createPopup(content, xy);

	};

	Popup.prototype = new Function();
	Popup.prototype.construtor = Popup;


	/**
	 * [__createPopup Criar Popup padrão do Openlayers]
	 * @param  {[String]} content [Conteúdo em formato HTML]
	 * @param  {[JSON]} xy [Coordenda onde a poppu vai ser aficionada no mapa]
	 */	
	Popup.prototype.__createPopup = function(content, xy) {

		this.__popup = new OpenLayers.Popup.FramedCloud(
			"chicken",
			this.__popupMap.getLonLatFromPixel(xy),
			null,
			content,
			null,
			true
		);

	};


	return Popup;

});