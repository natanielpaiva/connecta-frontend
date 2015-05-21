define([ConnectaGeoConfig.baseURL+'openlayersImplementation/heatmap-api/heatmap_api',
	ConnectaGeoConfig.baseURL+'utils/colorComponent'
], function(HeatMap, colorComponent) {

	var HeatMapLayer = function(configLayer) {
		Function.apply(this);

		//Construtor				
		this.__layer = new Heatmap.Layer(configLayer.name);

		this.__objMap = configLayer.MAP;
		var URL = configLayer.serverUrl.replace("wms", "wfs") + '?' + "service=WFS&version=1.0.0&request=GetFeature&typeName=" + configLayer.layer + "&srsName=EPSG:900913&outputformat=json";

		//Verifica se foi informado filtro
		if (configLayer.filter != "") {
			URL += "&CQL_FILTER=" + encodeURIComponent(configLayer.filter);
		}

		(typeof configLayer.colors != 'undefined') ? this.__setLayerStyle(configLayer.colors, URL): this.__getHeatMapData(URL);

		
	};

	HeatMapLayer.prototype = new Function();
	HeatMapLayer.prototype.construtor = HeatMapLayer;


	/**
	 * [__setLayerStyle Define o intervalo de cores da layer]
	 * @param  {[JSON]} colors [Objeto contendo as cores  do intervalo ]	 
	 * @param  {[String]} layerUrl [Url da Layer ]
	 */
	HeatMapLayer.prototype.__setLayerStyle = function(colors, URL) {

		var gradientHex = new colorComponent().calculateDegradee(colors.initialColor, colors.finalColor, 5, true);

		var cores = {};
		cores[0.00] = "0xffffff00";
		cores[0.10] = "0x" + colors.initialColor + "ff";
		cores[0.30] = "0x" + gradientHex[0].replace("#", "") + "ff";
		cores[0.50] = "0x" + gradientHex[1].replace("#", "") + "ff";
		cores[0.70] = "0x" + gradientHex[3].replace("#", "") + "ff";
		cores[0.99] = "0x" + colors.finalColor + "ff";
		cores[1.00] = "0x000000ff";

		this.__layer.setGradientStops(cores);

		this.__getHeatMapData(URL);

	};


	/**
	 * [__getHeatMapData Retorna os pontos da camada informada para gerar camada de heatMap]
	 * @param  {[String]} layerUrl [Url da Layer ]
	 */
	HeatMapLayer.prototype.__getHeatMapData = function(layerUrl) {
		var that = this,
			point, lonlat;

		var request = OpenLayers.Request.GET({
			url: layerUrl,
			async: false,
			callback: function(request) {

				var data = JSON.parse(request.responseText);


				//Verifica se retornou features
				if (data.features.length == 0) {
					return false;
				}



				for (var feature in data.features) {
					point = new Heatmap.Source(new OpenLayers.LonLat(data.features[feature].geometry.coordinates[0], data.features[feature].geometry.coordinates[1]));
					that.__layer.addSource(point);
				}

				that.__layer.defaultIntensity = 0.08;
				that.__layer.setOpacity(0.5);

				var layerCenter = that.__layer.getDataExtent().getCenterLonLat();
				that.__objMap.__map.setCenter(new OpenLayers.LonLat(layerCenter.lon, layerCenter.lat), 5);
			}


		});
	};


	return HeatMapLayer;

});