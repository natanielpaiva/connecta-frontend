define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Legend',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/Popup', ConnectaGeoConfig.baseURL+'utils/jkl-dumper', ConnectaGeoConfig.baseURL+'utils/ObjTree'
], function(Legend, Popup) {

	var MapserverLayer = function(configLayer) {
		Function.apply(this);
		console.log("configLayer", configLayer);

		this.__objMap = configLayer.MAP;

		this.__layerConfig = configLayer;

		this.__layer = new OpenLayers.Layer.WMS("Estados",
			configLayer.serverUrl + "?map=" + configLayer.mapFile, {
				layers: configLayer.layer,
				transparent: true,
			}, {
				isBaseLayer: false,
				singleTile: configLayer.singleTile
			}
		);



		//Verifica se a camada terá legenda
		if (configLayer.divLegend != "") {
			this.__createLayerLegend(configLayer);
		}

		this.__createInfoControl();



	};

	MapserverLayer.prototype = new Function();
	MapserverLayer.prototype.construtor = MapserverLayer;


	/**
	 * [__createLayerLegend Cria objeto de legenda para a camada]
	 * @param  {[JSON]} config [Config do Objeto de Legenda a ser criado ]
	 */
	MapserverLayer.prototype.__createLayerLegend = function(config) {
		this.__legend = new Legend(config);
	};



	/**
	 * [__setLegendVisibility Altera visibilidade da legenda]
	 * @param  {[Boolean]} visibility [Visibilidade da legenda true | false ]
	 */
	MapserverLayer.prototype.__setLegendVisibility = function(visibility) {

		(visibility) ? this.__legend.__show() : this.__legend.__hide();

	};



	/**
	 * [__createInfoControl Criar controle de info para a camada]
	 */
	MapserverLayer.prototype.__createInfoControl = function() {

		this.__infoControl = new OpenLayers.Control.WMSGetFeatureInfo({
			url: this.__layerConfig.serverUrl + "?map=" + this.__layerConfig.mapFile,
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
	MapserverLayer.prototype.__activateInfo = function() {
		this.__infoControl.activate();


	};

	/**
	 * [__deactivateInfo Desativa o controle de informação]
	 */
	MapserverLayer.prototype.__deactivateInfo = function() {
		this.__infoControl.deactivate();
	};



	/**
	 * [__getFeatureInfo Recupera a informação da camada]
	 * @param  {[JSON]} event [Evento do controle de info do Openlayers ]
	 */
	MapserverLayer.prototype.__getFeatureInfo = function(event) {
		console.info("EVENT", event);

		var XML2 = event.text;
		console.info("TEXT", XML2);
		//var re = /"/g;
		//var myJsonObject = xml2json.parser(XML2.replace(re, '').replace(' >', '>'));
		var xotree = new XML.ObjTree();
		var dumper = new JKL.Dumper();

		var tree = xotree.parseXML(XML2);
		var myJsonObject = dumper.dump(tree);

		console.info("JSON", myJsonObject);

		var json = new OpenLayers.Format.JSON();
		var data = json.read(myJsonObject);

		this.__showPopup(event, data.msGMLOutput);

	};



	/**
	 * [__showPopup Exibe popup com informação da camada]
	 * @param  {[JSON]} event [Evento do controle de info do Openlayers ]
	 * @param  {[JSON]} json [Objeto com as infomrações da camada ]
	 */
	MapserverLayer.prototype.__showPopup = function(event, json) {

		if (Object.keys(json).length == 3) {
			return false;
		}

		var objectName = Object.keys(json).sort().reverse()[0];


		console.info("OBJ", json[objectName]);

		var infoContent = "<b>Informações da Camada : " + objectName.replace('_layer', '') + "</b><br/><br/>";

		var featureName = Object.keys(json[objectName])[0];

		console.info("FEATURENAME",featureName);

		var feature=json[objectName][featureName];
		console.info("FEATURE OBJ",feature);


		//Percorre os atributos da feature para montar o conteúdo da popup
		for (var prop in feature) {

			if (prop != "rowid" && prop !='gml:boundedBy') {
				infoContent += "<b>" + prop + " : </b>" + feature[prop] + "<br/>";
			}
		}

		//console.info("CONTENT", infoContent);
		var popup = new Popup(this.__objMap, infoContent, event.xy);
		var map = this.__objMap.__getMap();

		this.__objMap.__map.addPopup(popup.__popup);

	};

	return MapserverLayer;

});