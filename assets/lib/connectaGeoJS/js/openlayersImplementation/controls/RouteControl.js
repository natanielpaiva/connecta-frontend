define(['openlayersImplementation/Layer'], function(Layer) {

	var RouteControl = function(configRoute) {
		Function.apply(this);

		//Extend da classe control do Openlayers
		OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
			defaultHandlerOptions: {
				'single': true,
				'double': false,
				'pixelTolerance': 0,
				'stopSingle': false,
				'stopDouble': false
			},

			initialize: function(options) {
				this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
				OpenLayers.Control.prototype.initialize.apply(
					this, arguments
				);
				this.handler = new OpenLayers.Handler.Click(
					this, {
						'click': this.trigger
					}, this.handlerOptions
				);
			},

			trigger: this.__addMarker.bind(this)

		});

		//Construtor                    		
		this.actualMarker = 'start';

		this.markerStyle = {
			externalGraphic: 'http://www.clker.com/cliparts/W/0/g/a/W/E/map-pin-red-hi.png',
			graphicHeight: 16,
			graphicWidth: 16
		};


		var configRouteLayer = {
			type: 'Vector',
			title: 'Layer para desenho de features',
			name: 'RouteLayer',
			MAP: configRoute.MAP
		};

		//Camadas auxiliares
		this.__routeLayer = new Layer(configRouteLayer);
		this.__routeMarkerLayer = new Layer(configRouteLayer);


		//OBJ do MAPA
		this.__objMap = configRoute.MAP;

		this.__control = new OpenLayers.Control.Click();


		this.__control.events.on({
			"activate": this.__activateRouteControl.bind(this),
			"deactivate": this.__deactivateRouteControl.bind(this)
		});


	};

	RouteControl.prototype = new Function();
	RouteControl.prototype.construtor = RouteControl;


	/**
	 * [__activateRouteControl Adiciona camada de desenho ao mapa]
	 */
	RouteControl.prototype.__activateRouteControl = function() {
		//console.info("DRAW LAYER ADD", this.__routeMarkerLayer);
		this.__objMap.__addLayer(this.__routeLayer);
		this.__objMap.__addLayer(this.__routeMarkerLayer);
	};


	/**
	 * [__deactivateRouteControl Remove camada de desenho do mapa]
	 */
	RouteControl.prototype.__deactivateRouteControl = function() {
		this.__routeMarkerLayer.__layerObj.__removeAllFeatures();
		this.__routeLayer.__layerObj.__removeAllFeatures();
		this.__objMap.__removeLayer(this.__routeMarkerLayer);
		this.__objMap.__removeLayer(this.__routeLayer);
	};


	/**
	 * [__addMarker Adiciona marcador no ponto clicado pelo usuário]
	 * @param  {[JSON]} event [Evento do click  do Openlayers ]
	 */	
	RouteControl.prototype.__addMarker = function(e) {		

		//Remove features das camadas
		if (this.actualMarker == 'init') {
			this.__routeMarkerLayer.__layerObj.__removeAllFeatures();
			this.__routeLayer.__layerObj.__removeAllFeatures();
			this.actualMarker = 'start'
		}

		var lonlat = this.__objMap.__map.getLonLatFromPixel(e.xy).transform(this.__objMap.__map.getProjection(), "EPSG:4326");
		//	console.info("LONLAT ", lonlat);

		var configPoint = {
			type: 'Point',
			x: lonlat.lon,
			y: lonlat.lat,
			featureStyle: this.markerStyle
		};

		this.__routeMarkerLayer.__layerObj.__createFeature(configPoint);

		//Caso seja o segundo marcador, chama função para calcular a rota
		if (this.actualMarker == 'end') {
			this.__calculateRoute();
		} else {
			this.actualMarker = 'end';
		}


	};



	/**
	 * [__calculateRoute Função que calcula a rota entre os pontos ]	 
	 */		
	RouteControl.prototype.__calculateRoute = function() {
		var features = this.__routeMarkerLayer.__layerObj.__layer.features;
		var that = this,
			pointList = [],
			startPoint = null,
			endPoint = null,
			lineFeature = null;
		features[0].geometry.transform(this.__objMap.__map.getProjection(), "EPSG:4326");
		features[1].geometry.transform(this.__objMap.__map.getProjection(), "EPSG:4326");

		// var URL = "http://maps.googleapis.com/maps/api/directions/json?origin=" + features[0].geometry.y + "," + features[0].geometry.x + "&destination=" + features[1].geometry.y + "," + features[1].geometry.x + "&region=br&sensor=false&alternatives=true";
		var URL = "http://maps.googleapis.com/maps/api/directions/json?origin=" + features[0].geometry.y + "," + features[0].geometry.x + "&destination=" + features[1].geometry.y + "," + features[1].geometry.x + "&region=br&sensor=false";
		request = OpenLayers.Request.GET({
			url: URL,
			async: false,
			callback: function(request) {
				//			console.info("ARGS", request);

				var data = JSON.parse(request.responseText);

				//		console.info("DATA JSON ", data);

				if (data.status == "OK") {

					var legs = data.routes[0].legs[0]
					//			console.info("LEGS", legs);
					var steps = legs.steps;
					//			console.info("STEPS", steps);

					var configStartPoint = {
						type: 'Point',
						x: legs.start_location.lng.toFixed(2),
						y: legs.start_location.lat.toFixed(2),
						featureStyle: that.markerStyle
					};

					var configEndPoint = {
						type: 'Point',
						x: legs.end_location.lng.toFixed(2),
						y: legs.end_location.lat.toFixed(2),
						featureStyle: that.markerStyle
					};

					that.__routeMarkerLayer.__layerObj.__removeAllFeatures();
					that.__routeLayer.__layerObj.__removeAllFeatures();
					that.__routeMarkerLayer.__layerObj.__createFeature(configStartPoint);
					that.__routeMarkerLayer.__layerObj.__createFeature(configEndPoint)

					var style = {
						strokeColor: '#0A4782',
						strokeOpacity: 1,
						strokeWidth: 5
					};



					for (var path in steps) {

						//Start Point
						startPoint = new OpenLayers.Geometry.Point(steps[path].start_location.lng.toFixed(2), steps[path].start_location.lat.toFixed(2)).transform(
							new OpenLayers.Projection('EPSG:4326'),
							that.__objMap.__map.getProjectionObject()
						);

						pointList.push(startPoint);

						//End Point
						endPoint = new OpenLayers.Geometry.Point(steps[path].end_location.lng.toFixed(2), steps[path].end_location.lat.toFixed(2)).transform(
							new OpenLayers.Projection('EPSG:4326'),
							that.__objMap.__map.getProjectionObject()
						);

						pointList.push(endPoint);
						lineFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(pointList), null, style);
						that.__routeLayer.__layerObj.__layer.addFeatures(lineFeature);

					}

					that.actualMarker = 'init';
				} else {
					that.__routeMarkerLayer.__layerObj.__removeAllFeatures();
					that.actualMarker = 'init';
				}

			}
		});

	};

	return RouteControl;

});