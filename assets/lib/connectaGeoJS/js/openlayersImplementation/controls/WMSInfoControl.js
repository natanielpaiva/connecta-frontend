define(['openlayersImplementation/Popup'], function(Popup) {

	var WMSInfoControl = function(configControl) {
		Function.apply(this);

		//Construtor						
		this.__control = new OpenLayers.Control.WMSGetFeatureInfo({
			url: configControl.serverUrl,
			title: configControl.title,
			queryVisible: true,
			infoFormat: 'application/vnd.ogc.gml',

			eventListeners: {
				getfeatureinfo: this.__getFeatureInfo.bind(this)
			}
		});

		//Criao Objeto do MAPA
		this.__objMap = configControl.MAP;

	};


	WMSInfoControl.prototype = new Function();
	WMSInfoControl.prototype.construtor = WMSInfoControl;



	/**
	 * [__getFeatureInfo Recupera a informação da camada]
	 * @param  {[JSON]} event [Evento do controle de info do Openlayers ]
	 */
	WMSInfoControl.prototype.__getFeatureInfo = function(event) {


		if (typeof event.features[0] == "undefined") {
			return false;
		}


		var that = this;

		var infoContent = "<b>Informações da Camada : " + event.features[0].gml.featureType + "</b><br/><br/>";

		//Percorre os atributos da feature para montar o conteúdo da popup
		for (var prop in event.features[0].attributes) {

			//Caso a camada possua como atributo um link , adiciona link para visualizá-lo em uma popup
			if (event.features[0].attributes[prop].indexOf('http://') > -1) {
				infoContent += "<b>" + prop + " : </b><span onclick=window.open('"+event.features[0].attributes[prop]+"','','width=300,height=300,left=100,top=50');><a href='#'>Visualizar</a></span><br/>";
			} else {

				infoContent += "<b>" + prop + " : </b>" + event.features[0].attributes[prop] + "<br/>";
			}

		}

		var popup = new Popup(this.__objMap, infoContent, event.xy);
		var map = this.__objMap.__getMap();

		this.__objMap.__map.addPopup(popup.__popup);

	};

	return WMSInfoControl;


});