define([ConnectaGeoConfig.baseURL+'AbstractMap', 
    //ConnectaGeoConfig.baseURL+'openlayersImplementation/async/async!googleMaps',
    ConnectaGeoConfig.baseURL+'openlayersImplementation/openlayers-api/OpenLayers-2.13.1/OpenLayers'],
	function(AbstractMap) {

		var Map = function(configMap, callback, paramsCallback) {
			Function.apply(this);


			//Define proxy a ser utilizado pelo openlayers
			var proxy = this.__openlayersProxyURL;
			OpenLayers.ProxyHost = proxy;


			//Construtor
			this.__objLayers = [];
			this.__objControls = [];
			this.__objBaseLayers = [];
			//Quantidade de base Layers
			this.__qtdBaseLayers = 0;
			//Zoom inicial do Mapa
			this.__initialZoom = configMap.initialZoom;


			//Função de callback			
			//Verifica função de callback a ser chamada quando o mapa estiver carregado 
			this.__callbackFunction = (typeof callback != 'undefined') ? callback : "";
			this.__callbackParams = (typeof paramsCallback != 'undefined') ? paramsCallback : "";

			this.__bingApiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";


			this["__add" + configMap.baseLayer + "BaseLayers"]();

			this.__createMap(configMap);

		};

		Map.prototype = new AbstractMap();
		Map.prototype.construtor = Map;

		Map.prototype.__createMap = function(configMap) {			

			this.__map = new OpenLayers.Map(configMap.divMap, {
				controls:[new OpenLayers.Control.Navigation(),(configMap.zoomSlider)?new OpenLayers.Control.PanZoomBar():new OpenLayers.Control.Zoom()],
				projection: configMap.projection,
				center: new OpenLayers.LonLat(configMap.center.x, configMap.center.y)
					.transform('EPSG:4326', configMap.projection)
			});

			this.__map.controls=[new OpenLayers.Control.PanZoomBar()];

			this.__map.events.register("addlayer", this.__map, this.__monitoringMap.bind(this));
			this.__map.addLayers(this.__objBaseLayers);

			this.__map.zoomTo(this.__initialZoom);

			//Restrição de extensão do mapa
			var extent = new OpenLayers.Bounds.fromString("-17654303.390625,-7902121.084072,17654303.390625,7902121.084072");

			this.__map.setOptions({
				restrictedExtent: extent
			});	

		};

		Map.prototype.__getMap = function() {
			return this.__map;

		};

		Map.prototype.__addGoogleBaseLayers = function() {

			this.__qtdBaseLayers = 4;

			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Physical", {
					type: google.maps.MapTypeId.TERRAIN
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Streets", // the default
				{
					numZoomLevels: 20
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Hybrid", {
					type: google.maps.MapTypeId.HYBRID,
					numZoomLevels: 20
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Satellite", {
					type: google.maps.MapTypeId.SATELLITE,
					numZoomLevels: 22
				}
			));

		};


		Map.prototype.__addBingBaseLayers = function() {
			this.__qtdBaseLayers = 3;

			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Road",
				key: this.__bingApiKey,
				type: "Road"
			}));

			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Hybrid",
				key: this.__bingApiKey,
				type: "AerialWithLabels"
			}));

			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Aerial",
				key: this.__bingApiKey,
				type: "Aerial"
			}));

		};

		Map.prototype.__addOsmBaseLayers = function() {
			this.__qtdBaseLayers = 1;

			this.__objBaseLayers.push(new OpenLayers.Layer.OSM("OpenStreetMap Base Layer"));

		};


		Map.prototype.__addAllBaseLayers = function(){

			this.__qtdBaseLayers = 8;

			//Google
			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Physical", {
					type: google.maps.MapTypeId.TERRAIN
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Streets", // the default
				{
					numZoomLevels: 20
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Hybrid", {
					type: google.maps.MapTypeId.HYBRID,
					numZoomLevels: 20
				}
			));


			this.__objBaseLayers.push(new OpenLayers.Layer.Google(
				"Google Satellite", {
					type: google.maps.MapTypeId.SATELLITE,
					numZoomLevels: 22
				}
			));


			//Bing 
			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Road",
				key: this.__bingApiKey,
				type: "Road"
			}));

			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Hybrid",
				key: this.__bingApiKey,
				type: "AerialWithLabels"
			}));

			this.__objBaseLayers.push(new OpenLayers.Layer.Bing({
				name: "Aerial",
				key: this.__bingApiKey,
				type: "Aerial"
			}));


			//OSM
			this.__objBaseLayers.push(new OpenLayers.Layer.OSM("OpenStreetMap Base Layer"));			


		};


		Map.prototype.__addCustomBaseLayer = function(configBaseLayer) {

			var baseLayer = new OpenLayers.Layer.WMS(configBaseLayer.title,
				configBaseLayer.serverUrl, {
					layers: configBaseLayer.layer,
					transparent: true
				}, {
					isBaseLayer: true,
					displayInLayerSwitcher: true
				});

			this.__objBaseLayers.push(baseLayer);
			this.__map.addLayer(baseLayer);

		};

		Map.prototype.__removeCustomBaseLayer = function(baseLayerName) {

			for (var baseLayer in this.__objBaseLayers) {

				if (this.__objBaseLayers[baseLayer].name == baseLayerName) {
					this.__map.removeLayer(this.__objBaseLayers[baseLayer]);
					var index = this.__objBaseLayers.indexOf(this.__objBaseLayers[baseLayer]);
					this.__objBaseLayers.splice(index, 1);
				}

			}

		};


		Map.prototype.__createLayer = function(config) {

			var that = this;			

			require([ConnectaGeoConfig.baseURL+'openlayersImplementation/Layer'], function(Layer) {

				config["MAP"] = that;
				var layer = new Layer(config);
				that.__addLayer(layer);

			});

		};

		Map.prototype.__addLayer = function(layer) {

			this.__map.addLayer(layer.__layerObj.__layer);
			this.__objLayers.push(layer);

		};

		Map.prototype.__removeLayer = function(layer) {

			this.__map.removeLayer(layer.__layerObj.__layer);
			var index = this.__objLayers.indexOf(layer);
			this.__objLayers.splice(index, 1);

			//Remove Legenda da Camada WMS
			if (typeof layer.__layerObj.__legend != 'undefined') {
				var element = document.getElementById(layer.__layerObj.__legend.__imgLegend);
				element.parentNode.removeChild(element);
			}

		};

		Map.prototype.__getLayerByName = function(layerName) {

			for (var layer in this.__objLayers) {

				if (this.__objLayers[layer].__layerObj.layerName == layerName)
					return this.__objLayers[layer];
			}

		};

		Map.prototype.__createControl = function(config) {

			var that = this;

			require([ConnectaGeoConfig.baseURL+'openlayersImplementation/Control'], function(Control) {

				config["MAP"] = that;
				var control = new Control(config);				
				that.__addControl(control);

			});

		};

		Map.prototype.__addControl = function(control) {

			this.__map.addControl(control.__controlObj.__control);
			this.__objControls.push(control);

		};

		Map.prototype.__removeControl = function(control) {

			this.__map.removeControl(control.__controlObj.__control);
			var index = this.__objControls.indexOf(control);
			this.__objControls.splice(index, 1);

		};

		Map.prototype.__getControlByName = function(controlName) {

			for (var control in this.__objControls) {

				if (this.__objControls[control].__controlObj.controlName == controlName)
					return this.__objControls[control];
			}

		};

		Map.prototype.__deactivateControls = function() {

			for (var control in this.__map.controls) {

				if (this.__map.controls[control].active)
					this.__map.controls[control].deactivate();
			}

			//Ativa o control de navegação do mapa
			this.__map.controls[0].activate();

		};

		Map.prototype.__zoomMapToMaxExtent = function() {

			this.__map.zoomToMaxExtent();

		};

		Map.prototype.__setMapCenter = function(configSetCenter) {

			//console.log("CONFIGSETCENTER", configSetCenter);
			var LonLat = new OpenLayers.LonLat(configSetCenter.point.x, configSetCenter.point.y).transform("EPSG:4326", this.__map.getProjection());
			this.__map.setCenter(LonLat, configSetCenter.zoom);

		};

		Map.prototype.__zoomMapToExtent = function(configBounds) {

			var bounds = new OpenLayers.Bounds(configBounds.minX, configBounds.minY, configBounds.maxX, configBounds.maxY).transform("EPSG:4326", this.__map.getProjection());
			this.__map.zoomToExtent(bounds);

		};

		Map.prototype.__createGeocoder = function() {
			var that = this;

			require([ConnectaGeoConfig.baseURL+'openlayersImplementation/Geocoder'], function(Geocoder) {

				that.__geocoder = new Geocoder(that);
			});

		};

		Map.prototype.__removeGeocoder = function() {
			this.__removeLayer(this.__getLayerByName("GeocoderLayer"));
			var elem = document.getElementById(this.__geocoder.__element.id);
			elem.parentNode.removeChild(elem);
			delete this.__geocoder;
		};


		Map.prototype.__switchBaseLayer = function(baseLayerName) {

			for (var layer in this.__objBaseLayers) {

				if (this.__objBaseLayers[layer].name == baseLayerName) {
					this.__map.setBaseLayer(this.__objBaseLayers[layer]);
				}
			}
		};

		Map.prototype.__monitoringMap = function() {			
			this.__qtdBaseLayers--;

			if (this.__qtdBaseLayers == 0) {

				//Remove listener do evento de verificar carregamento do mapa
				this.__map.events.listeners.addlayer.splice(2, 1);

				if (this.__callbackFunction != "") {
					//Chama função de callback quando o mapa estiver carregado					
					this[this.__callbackFunction](this.__callbackParams);
				}
			}


		};

		return Map;

	});