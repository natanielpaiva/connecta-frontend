define([ConnectaGeoConfig.baseURL+'openlayersImplementation/cluster-api/AnimatedCluster'], function(AnimatedCluster) {

	var ClusterLayer = function(configLayer) {
		Function.apply(this);

		//Construtor				
		this.__layer = new OpenLayers.Layer.Vector(configLayer.name, {
			renderers: ['Canvas', 'SVG'],
			strategies: [new OpenLayers.Strategy.AnimatedCluster({
				distance: 45,
				animationMethod: OpenLayers.Easing.Expo.easeOut,
				animationDuration: 20
			})]
		});

		this.__objMap = configLayer.MAP;

		//Estilo da camada de cluster
		this.__clusterStyle = (configLayer.styleConfig == "") ? this.__createClusterDefaultStyle() : this.__createClusterStyle(configLayer.styleConfig);

		var URL = configLayer.serverUrl.replace("wms", "wfs") + '?' + "service=WFS&version=1.0.0&request=GetFeature&typeName=" + configLayer.layer + "&srsName=EPSG:900913&outputformat=json";

		//Verifica se foi informado filtro
		if (configLayer.filter != "") {
			URL += "&CQL_FILTER=" + encodeURIComponent(configLayer.filter);
		}

		//chama função para gerar data para a camada
		this.__getClusterData(URL);

	};

	ClusterLayer.prototype = new Function();
	ClusterLayer.prototype.construtor = ClusterLayer;


	/**
	 * [__createClusterStyle Cria o estilo padrão para a camada de Cluster]
	 * @param  {[OpenLayers.StyleMap]}  [OpenLayers.StyleMap ]
	 */
	ClusterLayer.prototype.__createClusterDefaultStyle = function() {

		//Creating style for layer				
		var colors = {
			low: "rgb(181, 226, 140)",
			middleLess: "rgb(241, 211, 87)",
			middleGreater: "rgb(255,165,0)",
			high: "rgb(253, 156, 115)"
		};

		// Define three rules to style the cluster features.
		var lowRule = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.LESS_THAN,
				property: "count",
				value: 15
			}),
			symbolizer: {
				fillColor: colors.low,
				fillOpacity: 0.9,
				strokeColor: colors.low,
				strokeOpacity: 0.5,
				strokeWidth: 12,
				pointRadius: 10,
				label: "${count}",
				labelOutlineWidth: 1,
				fontColor: "#ffffff",
				fontOpacity: 0.8,
				fontSize: "12px"
			}
		});

		var middleLessRule = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: "count",
				lowerBoundary: 15,
				upperBoundary: 55
			}),
			symbolizer: {
				fillColor: colors.middleLess,
				fillOpacity: 0.9,
				strokeColor: colors.middleLess,
				strokeOpacity: 0.5,
				strokeWidth: 12,
				pointRadius: 15,
				label: "${count}",
				labelOutlineWidth: 1,
				fontColor: "#ffffff",
				fontOpacity: 0.8,
				fontSize: "12px"
			}
		});


		var middleGreaterRule = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.BETWEEN,
				property: "count",
				lowerBoundary: 55,
				upperBoundary: 100
			}),
			symbolizer: {
				fillColor: colors.middleGreater,
				fillOpacity: 0.9,
				strokeColor: colors.middleGreater,
				strokeOpacity: 0.5,
				strokeWidth: 12,
				pointRadius: 15,
				label: "${count}",
				labelOutlineWidth: 1,
				fontColor: "#ffffff",
				fontOpacity: 0.8,
				fontSize: "12px"
			}
		});

		var highRule = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type: OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "count",
				value: 100
			}),
			symbolizer: {
				fillColor: colors.high,
				fillOpacity: 0.9,
				strokeColor: colors.high,
				strokeOpacity: 0.5,
				strokeWidth: 12,
				pointRadius: 20,
				label: "${count}",
				labelOutlineWidth: 1,
				fontColor: "#ffffff",
				fontOpacity: 0.8,
				fontSize: "12px"
			}
		});

		// Create a Style that uses the three previous rules
		var style = new OpenLayers.Style(null, {
			rules: [lowRule, middleLessRule, middleGreaterRule, highRule]
		});

		return new OpenLayers.StyleMap(style);

	};


	/**
	 * [__createClusterStyle Cria o estilo personalizado para a camada de Cluster]
	 * @param  {[JSON]} styleConfig [Objeto com as configurações de estilo]
	 * @param  {[OpenLayers.StyleMap]}  [OpenLayers.StyleMap ]
	 */
	ClusterLayer.prototype.__createClusterStyle = function(styleConfig) {
		var jsonParams = [];
		var configParameters = styleConfig;

		for (var paramObj in configParameters) {
			var objNames = configParameters[paramObj].parameterName.split("#");
			var objValues = configParameters[paramObj].parameterValue.split("~");
			var json = {};

			for (var i = 0; i < objNames.length; i++) {
				json[objNames[i]] = objValues[i];
			}

			jsonParams.push(json);

		}

		var rules = [];

		for (var i = 0; i < jsonParams.length; i++) {

			if (i == 0) {

				rules.push(new OpenLayers.Rule({
					filter: new OpenLayers.Filter.Comparison({
						type: OpenLayers.Filter.Comparison.LESS_THAN,
						property: 'count',
						value: (parseInt(jsonParams[1].less) - 1)
					}),
					symbolizer: {
						fillColor: jsonParams[i].clusterColor,
						fillOpacity: parseFloat(jsonParams[i].opacity),
						strokeColor: jsonParams[i].clusterColor,
						strokeOpacity: 0.5,
						strokeWidth: 12,
						pointRadius: parseInt(jsonParams[i].radius),
						label: '${count}',
						labelOutlineWidth: 1,
						fontColor: jsonParams[i].fontColor,
						fontOpacity: 0.8,
						fontSize: '12px'
					}
				}));

			} else if (i == jsonParams.length - 1) {

				rules.push(new OpenLayers.Rule({
					filter: new OpenLayers.Filter.Comparison({
						type: OpenLayers.Filter.Comparison.GREATER_THAN,
						property: 'count',
						value: (parseInt(jsonParams[i - 1].greater) + 1)
					}),
					symbolizer: {
						fillColor: jsonParams[i].clusterColor,
						fillOpacity: parseFloat(jsonParams[i].opacity),
						strokeColor: jsonParams[i].clusterColor,
						strokeOpacity: 0.5,
						strokeWidth: 12,
						pointRadius: parseInt(jsonParams[i].radius),
						label: '${count}',
						labelOutlineWidth: 1,
						fontColor: jsonParams[i].fontColor,
						fontOpacity: 0.8,
						fontSize: '12px'
					}
				}));

			} else {

				rules.push(new OpenLayers.Rule({
					filter: new OpenLayers.Filter.Comparison({
						type: OpenLayers.Filter.Comparison.BETWEEN,
						property: 'count',
						lowerBoundary: parseInt(jsonParams[i].less),
						upperBoundary: parseInt(jsonParams[i].greater)
					}),
					symbolizer: {
						fillColor: jsonParams[i].clusterColor,
						fillOpacity: parseFloat(jsonParams[i].opacity),
						strokeColor: jsonParams[i].clusterColor,
						strokeOpacity: 0.5,
						strokeWidth: 12,
						pointRadius: parseInt(jsonParams[i].radius),
						label: '${count}',
						labelOutlineWidth: 1,
						fontColor: jsonParams[i].fontColor,
						fontOpacity: 0.8,
						fontSize: '12px'
					}
				}));

			}
		}

		var style = new OpenLayers.Style(null, {
			rules: rules
		});

		return new OpenLayers.StyleMap(style);

	};


	/**
	 * [__getClusterData Retorna os pontos da camada informada para gerar camada de cluster]
	 * @param  {[String]} layerUrl [Url da Layer ]
	 */
	ClusterLayer.prototype.__getClusterData = function(layerUrl) {

		var that = this,
			features = [],
			lonlat;


		var request = OpenLayers.Request.GET({
			url: layerUrl,
			async: true,
			callback: function(request) {
				var json = new OpenLayers.Format.JSON();
				var data = json.read(request.responseText);

				//Verifica se retornou features
				if (data.features.length == 0) {
					return false;
				}

				for (var feature in data.features) {

					lonlat = new OpenLayers.LonLat(data.features[feature].geometry.coordinates[0], data.features[feature].geometry.coordinates[1]);
					f = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat));
					features.push(f);

				}
				that.__layer.styleMap = that.__clusterStyle;

				that.__layer.addFeatures(features);
				var layerCenter = that.__layer.getDataExtent().getCenterLonLat();
				that.__objMap.__map.setCenter(new OpenLayers.LonLat(layerCenter.lon, layerCenter.lat), 5);


			}
		});

	};


	return ClusterLayer;

});