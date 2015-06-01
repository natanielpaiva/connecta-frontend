define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Popup'], function(Popup) {

	var InfoFeatureControl = function(configInfoFeature) {
		Function.apply(this);

		//Construtor
		//OBJ do MAPA
		this.__objMap = configInfoFeature.MAP;

		this.__control = new OpenLayers.Control.SelectFeature([configInfoFeature.MAP.__getLayerByName(configInfoFeature.layerName).__layerObj.__layer]);

		this.__control.events.on({
			"featurehighlighted": this.__onFeatureSelect.bind(this),
			"featureunhighlighted": this.__onFeatureUnSelect.bind(this)
		});

	};

	InfoFeatureControl.prototype = new Function();
	InfoFeatureControl.prototype.construtor = InfoFeatureControl;



	/**
	 * [__onFeatureSelect Verifica se a feature possui atributos]
	 * @param  {[Event]} evt [Evento do controle de seleção]
	 */
	InfoFeatureControl.prototype.__onFeatureSelect = function(evt) {
		//Armazena a feature selecionada atualmente
		this.__selectedFeature = evt.feature;

		if (typeof this.__selectedFeature.attributes != 'undefined') {
			this.__getFeatureInfo();
		}

	};


	/**
	 * [__onFeatureUnSelect Remove a popup do mapa]
	 * @param  {[Event]} evt [Evento do controle de seleção]
	 */
	InfoFeatureControl.prototype.__onFeatureUnSelect = function(evt) {
		this.__objMap.__map.removePopup(evt.feature.popup);
		evt.feature.popup.destroy();
		evt.feature.popup = null;
	};


	/**
	 * [__onPopupClose Remove a seleção da feature]
	 */
	InfoFeatureControl.prototype.__onPopupClose = function() {
		this.__control.unselect(this.__selectedFeature);
	};


	/**
	 * [__getFeatureInfo Recupera a informação da feature]
	 */
	InfoFeatureControl.prototype.__getFeatureInfo = function() {

		var infoContent = "<b>Informações da Feature : <br/><br/>";

		//Percorre os atributos da feature para montar o conteúdo da popup
		for (var prop in this.__selectedFeature.attributes) {
			infoContent += "<b>" + prop + " : </b>" + this.__selectedFeature.attributes[prop] + "<br/>";
		}

		//Adciona popup ao mapa
		this.__featurePopup = new Popup (this.__objMap.__map, infoContent, this.__selectedFeature.geometry.getBounds().getCenterLonLat());




		this.__selectedFeature.popup = this.__featurePopup;
		this.__objMap.__map.addPopup(this.__featurePopup);

	};

	return InfoFeatureControl;

});