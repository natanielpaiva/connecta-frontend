define(['openlayersImplementation/Layer'], function(Layer) {

	var Geocoder = function(configMap) {
		Function.apply(this);

		//Construtor		
		// adicionar geocodificador do GOOGLE
		this.__googleGeocoder = new google.maps.Geocoder();

		var configGeocoderLayer = {
			type: 'Vector',
			title: 'Layer para desenho de features',
			name: 'GeocoderLayer',
			MAP: configMap
		};

		//Camada para adicionar os pontos geocodificados
		this.__geocoderLayer = new Layer(configGeocoderLayer);

		this.__objMap = configMap;

		this.__objMap.__addLayer(this.__geocoderLayer);

		//Cria DIV para os campos de pesquisa e botões
		this.__element = document.createElement('div');
		this.__element.id = "idGeocode_" + this.__objMap.objMapName;
		document.body.appendChild(this.__element);
		this.__element.style.zIndex = '9999';
		this.__element.style.position = 'absolute';
		this.__element.style.background = '#FFFFFF';
		this.__element.style.left = '350px';
		this.__element.style.width = '366px';
		this.__element.style.height = '25px';
		this.__element.innerHTML = "Endereço : <input  id='address_" + this.__objMap.objMapName + "' type='text' name='address'><input type='button' id='btnLimpar_" + this.__objMap.objMapName + "' value='Limpar'> <input type='button' id='btnGeocode_" + this.__objMap.objMapName + "' value='Geocode' >";

		//Adiciona evento para o btnLimpar
		document.getElementById('btnLimpar_' + this.__objMap.objMapName).onclick = this.__clear.bind(this);

		//Adiciona evento para o btnGeocode
		document.getElementById('btnGeocode_' + this.__objMap.objMapName).onclick = this.__geocode.bind(this);



	};

	Geocoder.prototype = new Function();
	Geocoder.prototype.construtor = Geocoder;



	/**
	 * [__geocode Geocodifica o endereço digitado e adiciona um marcador no mapa]
	 */
	Geocoder.prototype.__geocode = function() {
		console.info("Address", document.getElementById("address_" + this.__objMap.objMapName).value);

		//Remove features da layer caso existam
		if (this.__geocoderLayer.__layerObj.__objFeatures.length > 0) {
			this.__geocoderLayer.__layerObj.__removeAllFeatures();
		}

		var that = this;
		this.__googleGeocoder.geocode({
			'address': this.__retirarAcentos(document.getElementById("address_" + this.__objMap.objMapName).value)
		}, function(results, status) {
			console.log("STATUS GEOCODE", status);
			if (status == google.maps.GeocoderStatus.OK) {

				// console.info("SPLIT GEOMETRY", results[0].geometry.location.toString());

				var geom = results[0].geometry.location.toString().split(",");

				// console.info("GEOM", geom);

				var latitude = geom[0].replace("(", "");
				var longitude = geom[1].replace(")", "");

				// console.info("COORDS", longitude, latitude);

				var pointStyle = {
					graphicName: 'x',
					strokeColor: '#f00',
					strokeWidth: 2,
					fillOpacity: 0.5,
					pointRadius: 15
				};

				var point = {
					type: 'Point',
					x: longitude,
					y: latitude,
					featureStyle: pointStyle
				};

				that.__geocoderLayer.__layerObj.__createFeature(point);
				that.__geocoderLayer.__layerObj.__layer.redraw();

				that.__objMap.__map.zoomToExtent(that.__geocoderLayer.__layerObj.__layer.getDataExtent());

			} else {
				console.info("ERROR");
			}
		});



	};


	/**
	 * [__clear Limpa todos os resultados da geocodificação]
	 */
	Geocoder.prototype.__clear = function() {
		console.info("CLEAR");
		document.getElementById("address_" + this.__objMap.objMapName).value = "";
		this.__geocoderLayer.__layerObj.__removeAllFeatures();
		this.__objMap.__map.zoomTo(4);
	};

	/**
	 * [__retirarAcentos Remove acentos de uma String]
	 * @param  {String} string [string acentuada]
	 * @return {String}        [string sem acentos]
	 */
	Geocoder.prototype.__retirarAcentos = function(string) {

		string = string.replace(new RegExp('[ÁÀÂÃáàãâ]', 'gi'), 'a');
		string = string.replace(new RegExp('[ÉÈÊéèê]', 'gi'), 'e');
		string = string.replace(new RegExp('[ÍÌÎíìî]', 'gi'), 'i');
		string = string.replace(new RegExp('[ÓÒÔÕóòôõ]', 'gi'), 'o');
		string = string.replace(new RegExp('[ÚÙÛúùû]', 'gi'), 'u');
		string = string.replace(new RegExp('[Çç]', 'gi'), 'c');

		return string;
	};


	/**
	 * [__show Exibe os controls de geocodificação]	 
	 */
	Geocoder.prototype.__show = function() {
		document.getElementById(this.__element.id).style.opacity = 1;
	};


	/**
	 * [__hide Esconde os controls de geocodificação]	 
	 */
	Geocoder.prototype.__hide = function() {
		document.getElementById(this.__element.id).style.opacity = 0;

	};


	return Geocoder;

});