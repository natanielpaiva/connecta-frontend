define(['openlayersImplementation/Layer'], function(Layer) {

	var SpatialFilterControl = function(configSpatialFilter) {
		Function.apply(this);

		//Construtor	

		var configSpatialLayer = {
			type: 'Vector',
			title: 'Layer para desenho de features',
			name: 'DrawSpatialLayer',
			MAP: configSpatialFilter.MAP
		};

		this.__drawLayer = new Layer(configSpatialLayer);

		//OBJ do MAPA
		this.__objMap = configSpatialFilter.MAP;

		this.__control = new OpenLayers.Control.DrawFeature(
			this.__drawLayer.__layerObj.__layer,
			OpenLayers.Handler.RegularPolygon, {
				handlerOptions: {
					sides: 4,
					irregular: true,
					persist: true
				}
			}
		);

		//Filtro Espacial-> Default CONTAINS
		this.__ObjFilterType = "WITHIN";
		this.__control.events.on({
			"activate": this.__activateDrawControl.bind(this),
			"deactivate": this.__deactivateDrawControl.bind(this)
		});


		this.__drawLayer.__layerObj.__layer.events.on({
			featureadded: this.__applySpatialFilter.bind(this)
		});

	};

	SpatialFilterControl.prototype = new Function();
	SpatialFilterControl.prototype.construtor = SpatialFilterControl;


	/**
	 * [__activateDrawControl Adiciona camada de desenho ao mapa ]
	 */
	SpatialFilterControl.prototype.__activateDrawControl = function() {
		this.__objMap.__addLayer(this.__drawLayer);
	};


	/**
	 * [__deactivateDrawControl Remove camada de desenho do mapa ]
	 */
	SpatialFilterControl.prototype.__deactivateDrawControl = function() {
		this.__drawLayer.__layerObj.__removeAllFeatures();
		this.__objMap.__removeLayer(this.__drawLayer);
	};



	/**
	 * [__switchFiltertype Altera Tipo de filtro espacial ]
	 * @param  {[String]} filterType [Tipo do filtro espacial -. WITHIN(Contains) || INTERSECTS(INTERSECTION) || DISJOINT(EXCLUSÃO) ]
	 */
	SpatialFilterControl.prototype.__switchFiltertype = function(filterType) {
		this.__ObjFilterType = filterType;

	};


	/**
	 * [__applySpatialFilter Aplica filtro espacial nas camadas que estão visíveis no mapa]
	 * @param  {[JSON]} event [Evento do controle de desenho do Openlayers ]
	 */
	SpatialFilterControl.prototype.__applySpatialFilter = function(event) {

		this.__control.deactivate();

		var that = this;

		var geometry = event.feature.geometry;
		geometry.transform(this.__objMap.__map.getProjection(),
			new OpenLayers.Projection('EPSG:4326'));

		this.__drawLayer.__layerObj.__removeAllFeatures();

		var request, geoColumn = null,
			bounds, layerFilter;

		for (var layer in this.__objMap.__objLayers) {

			//	console.info("LAYER", this.__objMap.__objLayers[layer]);


			if (this.__objMap.__objLayers[layer].__layerObj.__layer.visibility && this.__objMap.__objLayers[layer].__layerObj.__layer.CLASS_NAME == 'OpenLayers.Layer.WMS') {


				layerFilter = this.__objMap.__objLayers[layer].__layerObj.__layer;
				bounds = geometry.getBounds();
				geoColumn = null;
				//		console.info("LAYER NAME", layerFilter.params.LAYERS);
				var URL = layerFilter.serverUrl.replace("wms", "wfs") + '?' + "service=WFS&version=1.0.0&request=DescribeFeatureType&typeName=" + layerFilter.params.LAYERS + "&outputFormat=application/json";

				request = OpenLayers.Request.GET({
					url: URL,
					async: false,
					callback: function(request) {
						//			console.info("ARGS", request);

						var data = JSON.parse(request.responseText);

						//			console.info("DATA JSON ", data);

						for (var property in data.featureTypes[0].properties) {
							if (data.featureTypes[0].properties[property].type.indexOf("gml:") > -1) {
								geoColumn = data.featureTypes[0].properties[property].name;
							}
						}

						//			console.info("GEO COLUMN", geoColumn);
						//			console.info("LAYER MERGE", layerFilter);

						layerFilter.mergeNewParams({
							'CQL_FILTER': that.__ObjFilterType + '(' + geoColumn + ' ,' + geometry + ')'
						});

					}
				});

			}
		}
		this.__control.activate();

	};



	/**
	 * [__removeSpatialFilter Remove o filtro espacial]	 
	 */	
	SpatialFilterControl.prototype.__removeSpatialFilter = function() {
		for (var layer in this.__objMap.__objLayers) {
			if (this.__objMap.__objLayers[layer].__layerObj.__layer.visibility && this.__objMap.__objLayers[layer].__layerObj.__layer.CLASS_NAME == 'OpenLayers.Layer.WMS') {
				this.__objMap.__objLayers[layer].__removeLayerFilter();
			}
		}

	};


	return SpatialFilterControl;

});