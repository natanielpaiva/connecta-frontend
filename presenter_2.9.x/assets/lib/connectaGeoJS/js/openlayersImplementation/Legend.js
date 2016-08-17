define([], function() {

	var Legend = function(configLegend) {
		Function.apply(this);

		//Construtor		
		//Assim que cria o mapa, consequentemente a legenda é criada
		this.__createLegend(configLegend);
		this.__imgLegend = "img_" + configLegend.layer;

	};

	Legend.prototype = new Function();
	Legend.prototype.construtor = Legend;

	/**
	 * [__createLegend Cria a legenda da camada WMS]
	 * @param  {[JSON]} configLegend [Config da Legenda a ser criada]
	 */
	Legend.prototype.__createLegend = function(configLegend) {
		var divLegend = document.getElementById(configLegend.divLegend);		

		//MapServer
		if (configLegend.type == "Mapserver") {

			var divLegendContent = "<br/><div id='img_" + configLegend.layer + "'>" + configLegend.layer + "<br/><hr><img src=" + configLegend.serverUrl + "?map="+configLegend.mapFile+"&mode=legend&LAYER=" + configLegend.layer + "></div>";

		//MapViewer
		}else if (configLegend.type == "Mapviewer"){			

			var divLegendContent = "<br/><div id='img_" + configLegend.layer + "'>" + configLegend.layer + "<br/><hr><img src=" + configLegend.serverUrl.replace('/wms','/omserver') + "?sty="+configLegend.styleName+"&w=20&h=40&ds=" + configLegend.datasource + "></div>";

		//Geoserver
		} else {
			var layerStyle = (configLegend.style != null) ? configLegend.style : "";			
			var divLegendContent = "<br/><div id='img_" + configLegend.layer + "'>" + configLegend.layer + "<br/><hr><img src=" + configLegend.serverUrl + "?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&TRANSPARENT=true&HEIGHT=40&LAYER=" + configLegend.layer + "&style=" + layerStyle + " ></div>";			
		}

		divLegend.innerHTML = divLegend.innerHTML + divLegendContent;

	};


	/**
	 * [__show Exibe a legenda]
	 */
	Legend.prototype.__show = function() {

		document.getElementById(this.__imgLegend).style.opacity = 1;

	};


	/**
	 * [__hide Esconde a legenda]
	 */
	Legend.prototype.__hide = function() {

		document.getElementById(this.__imgLegend).style.opacity = 0;
	};


	return Legend;

});