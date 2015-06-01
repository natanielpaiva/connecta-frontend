define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Legend',
	ConnectaGeoConfig.baseURL+'openlayersImplementation/TimeLine'
], function(Legend, TimeLine) {

	var WMSLayer = function(configLayer) {
		Function.apply(this);
		//Construtor				


		var objParams = {
			layers: configLayer.layer,			
			styles: configLayer.style,
			transparent: true
		};


		//Verifica se foi informado filtro para a camada
		if (configLayer.filter != "") {
			objParams["CQL_FILTER"] = configLayer.filter;
		}

			
		
		


		this.__layer = new OpenLayers.Layer.WMS(configLayer.title,
			configLayer.serverUrl, objParams, {
				isBaseLayer: false,
				displayInLayerSwitcher: false
			});

		this.__layer["serverUrl"] = configLayer.serverUrl;

		this.__layerConfig = configLayer;


		//Verifica se a camada terá legenda
		if(configLayer.divLegend != ""){
			this.__createLayerLegend(configLayer);
		}

		

	};

	WMSLayer.prototype = new Function();
	WMSLayer.prototype.construtor = WMSLayer;



	/**
	 * [__setCQLFILTER Aplica filtro na camada]
	 * @param  {[String]} query [Filtro a ser aplicado na WMS layer ]
	 */
	WMSLayer.prototype.__setCQLFILTER = function(query) {
		this.__layer.mergeNewParams({
			'CQL_FILTER': query
		});

	};



	/**
	 * [__setLayerStyle Muda Estilo da camada]
	 * @param  {[String]} styleName [Nome do estilo a ser aplicado na WMS layer ]
	 */
	WMSLayer.prototype.__setLayerStyle = function(styleName) {
		this.__layer.mergeNewParams({
			'styles': style
		});

	};



	/**
	 * [__createLayerLegend Cria objeto de legenda para a camada]
	 * @param  {[JSON]} config [Config do Objeto de Legenda a ser criado ]
	 */
	WMSLayer.prototype.__createLayerLegend = function(config) {
		this.__legend = new Legend(config);
	};



	/**
	 * [__setLegendVisibility Altera visibilidade da legenda]
	 * @param  {[Boolean]} visibility [Visibilidade da legenda true | false ]
	 */
	WMSLayer.prototype.__setLegendVisibility = function(visibility) {

		(visibility) ? this.__legend.__show() : this.__legend.__hide();

	};


	/**
	 * [__createLayerTimeline Cria o componente de Time Line]
	 * @param  {[String]} columnName [Nome da coluna com dados de tempo, para realizar o filtro]
	 */
	WMSLayer.prototype.__createLayerTimeline = function(columnName) {

		this.__layerConfig["columnName"] = columnName;
		this.__layerConfig["Layer"] = this.__layer;
		this.__timeline = new TimeLine(this.__layerConfig);

	};

	return WMSLayer;

});