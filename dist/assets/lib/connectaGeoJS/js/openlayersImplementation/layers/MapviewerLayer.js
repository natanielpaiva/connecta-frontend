define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Legend',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/Popup',
	ConnectaGeoConfig.baseURL+'utils/jkl-dumper', ConnectaGeoConfig.baseURL+'utils/ObjTree'
], function(Legend, Popup) {

	var MapviewerLayer = function(configLayer) {
		Function.apply(this);
		console.log("configLayer", configLayer);

		this.__objMap = configLayer.MAP;

		this.__layerConfig = configLayer;


		var objParams = {
			layers: configLayer.layer,
			datasource: configLayer.datasource,
			transparent: true,
			sty: configLayer.styleName
		};


		this.__layer = new OpenLayers.Layer.WMS(configLayer.title,
			configLayer.serverUrl, objParams, {
				isBaseLayer: false,
				displayInLayerSwitcher: false
			});

		//Verifica se a camada terá legenda
		if (configLayer.divLegend != "") {
			this.__createLayerLegend(configLayer);
		}

		this.__createInfoControl();



	};

	MapviewerLayer.prototype = new Function();
	MapviewerLayer.prototype.construtor = MapviewerLayer;


	/**
	 * [__createLayerLegend Cria objeto de legenda para a camada]
	 * @param  {[JSON]} config [Config do Objeto de Legenda a ser criado ]
	 */
	MapviewerLayer.prototype.__createLayerLegend = function(config) {
		this.__legend = new Legend(config);
	};



	/**
	 * [__setLegendVisibility Altera visibilidade da legenda]
	 * @param  {[Boolean]} visibility [Visibilidade da legenda true | false ]
	 */
	MapviewerLayer.prototype.__setLegendVisibility = function(visibility) {

		(visibility) ? this.__legend.__show() : this.__legend.__hide();

	};


	/**
	 * [__createInfoControl Criar controle de info para a camada]
	 */
	MapviewerLayer.prototype.__createInfoControl = function() {

		this.__infoControl = new OpenLayers.Control.WMSGetFeatureInfo({
			url: this.__layerConfig.serverUrl,
			title: this.__layerConfig.title,
			queryVisible: true,
			infoFormat: 'application/vnd.ogc.gml',

			eventListeners: {
				getfeatureinfo: this.__getFeatureInfo.bind(this)
			}
		});


		this.__objMap.__map.addControl(this.__infoControl);


	};


	/**
	 * [__activateInfo Ativa o controle de informação]
	 */
	MapviewerLayer.prototype.__activateInfo = function() {
		this.__infoControl.activate();


	};

	/**
	 * [__deactivateInfo Desativa o controle de informação]
	 */
	MapviewerLayer.prototype.__deactivateInfo = function() {
		this.__infoControl.deactivate();
	};


	/**
	 * [__getFeatureInfo Recupera a informação da camada]
	 * @param  {[JSON]} event [Evento do controle de info do Openlayers ]
	 */
	MapviewerLayer.prototype.__getFeatureInfo = function(event) {
		
		var XML2 = event.text;			
		var xotree = new XML.ObjTree();
		var dumper = new JKL.Dumper();

		var tree = xotree.parseXML(XML2);
		var myJsonObject = dumper.dump(tree);		

		var json = new OpenLayers.Format.JSON();
		var data = json.read(myJsonObject);

		this.__showPopup(event, data.GetFeatureInfo_Result);

	};



	/**
	 * [__showPopup Exibe popup com informação da camada]
	 * @param  {[JSON]} event [Evento do controle de info do Openlayers ]
	 * @param  {[JSON]} json [Objeto com as infomrações da camada ]
	 */
	MapviewerLayer.prototype.__showPopup = function(event, json) {

		if (typeof json.ROWSET.ROW == 'undefined') {
			return false;
		}

		var infoContent = "<b>Informações da Camada : " + json.ROWSET['-name'] + "</b><br/><br/>";

		//Percorre os atributos da feature para montar o conteúdo da popup
		var feature = (json.ROWSET.ROW.length > 1) ? json.ROWSET.ROW[0] : json.ROWSET.ROW;
		for (var prop in feature) {

			if (prop != "-num") {
				infoContent += "<b>" + prop + " : </b>" + feature[prop] + "<br/>";
			}
		}

		//console.info("CONTENT", infoContent);
		var popup = new Popup(this.__objMap, infoContent, event.xy);
		var map = this.__objMap.__getMap();

		this.__objMap.__map.addPopup(popup.__popup);

	};

	return MapviewerLayer;

});