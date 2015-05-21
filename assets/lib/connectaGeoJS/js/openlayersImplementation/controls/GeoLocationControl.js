define(['openlayersImplementation/Layer', 'openlayersImplementation/Feature'], function(Layer, Feature) {

	var GeoLocationControl = function(config) {
		Function.apply(this);

		//Construtor		
		var configVectorLayer = {
			type: 'Vector',
			title: 'Layer Geolocation',
			name: 'GeolocationLayer',
			MAP: config.MAP
		};

		var that = this;

		//OBJ do MAPA
		this.__objMap = config.MAP;

		this.__geolocationLayer = new Layer(configVectorLayer);
		//console.info("VECTOR LAYER GEOLOCATION", this.__geolocationLayer);

		this.__control = new OpenLayers.Control.Geolocate({
			bind: false,
			geolocationOptions: {
				enableHighAccuracy: false,
				maximumAge: 0,
				timeout: 7000
			}
		});


		this.__control.events.on({
			"activate": this.__activateGeoLocationControl.bind(this),
			"deactivate": this.__deactivateGeoLocationControl.bind(this)
		});

		this.__control.events.register("locationupdated", this.__control, function(e) {
			that.__geolocationLayer.__layerObj.__removeAllFeatures();


			var markerStyle = {
				graphicName: 'x',
				strokeColor: '#f00',
				strokeWidth: 2,
				fillOpacity: 0.5,
				pointRadius: 15
			};

			e.point.transform("EPSG:3857", "EPSG:4326");

			//	console.info("EVENT", e);

			var point = {
				type: 'Point',
				x: e.point.x,
				y: e.point.y,
				featureStyle: markerStyle
			};


			that.__geolocationLayer.__layerObj.__createFeature(point);

			that.__ObjMap.__map.zoomToExtent(that.__geolocationLayer.__layerObj.__layer.getDataExtent());

		});

		this.__control.events.register("locationfailed", this, function() {
			OpenLayers.Console.log('Location detection failed');
		});



	};

	GeoLocationControl.prototype = new Function();
	GeoLocationControl.prototype.construtor = GeoLocationControl;



	/**
	 * [__activateGeoLocationControl Adiciona camada das distâncias ao mapa]
	 */
	GeoLocationControl.prototype.__activateGeoLocationControl = function() {
		this.__objMap.__addLayer(this.__geolocationLayer);
	};



	/**
	 * [__deactivateGeoLocationControl Remove camada das distâncias do mapa]
	 */	
	GeoLocationControl.prototype.__deactivateGeoLocationControl = function() {
		this.__geolocationLayer.__layerObj.__removeAllFeatures();
		this.__objMap.__removeLayer(this.__geolocationLayer);
		this.__objMap.__zoomToMapMaxExtent();
	};

	return GeoLocationControl;

});