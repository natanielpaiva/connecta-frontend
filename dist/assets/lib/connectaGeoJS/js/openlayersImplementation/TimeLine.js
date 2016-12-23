define([], function() {

	var TimeLine = function(configTimeLine) {
		Function.apply(this);
		//Construtor		
                
		//atribuição do nome da coluna a ser feita a comparação do filtro
        this.__columnName = configTimeLine.columnName;
        //layer atualmente sendo utilizada
		this.__layer = configTimeLine.Layer;

		this.__objMap = configTimeLine.MAP;
		//Camada para se realizar o efeito de Linha do Tempo
		var URL = configTimeLine.serverUrl.replace("wms", "wfs") + '?' + "service=WFS&version=1.0.0&request=GetFeature&typeName=" + configTimeLine.layer + "&srsName=EPSG:900913&outputformat=json&propertyName=" + configTimeLine.columnName;
		this.__getTimelineData(URL);
	};

	TimeLine.prototype = new Function();
	TimeLine.prototype.construtor = TimeLine;

    /**
	 * [__getTimelineData requisição com o servidor para retornar os dados de uma coluna determinada]
	 * @param  {[String]} URL [URL com a requisição de retorno do JSON]
	 */
    TimeLine.prototype.__getTimelineData = function(URL) {
	        var that = this;
	        var columnName = this.__columnName;
	        var lowerYear = 9999;
	        var bigYear = 0;
	        var request = OpenLayers.Request.GET({
	            url: URL,
	            async: false,
	            callback: function(request) {
	                //transformando a resposta da requisição em JSON
	                var json = new OpenLayers.Format.JSON();
	                var data = json.read(request.responseText);

	                //for de iteração dos dados do objJson, pegando apenas a propriedade com os dados dos anos
	                for (var lol in data.features) {
	                    //current recebe o valor atual do ano dentro da iteração
	                    var current = eval("data.features[lol].properties." + columnName);
	                    //se o valor atual for menor do que o "menor ano"
	                    if (current < lowerYear) {
	                        //menor ano recebe o ano atual
	                        lowerYear = current;
	                    }
	                    //se o valor atual for maior do que o "maior ano"
	                    if (current > bigYear) {
	                        //maior ano recebe o ano atual
	                        bigYear = current;
	                    }
	                }
	                //função que realiza a criação do SLIDER, de acordo com os valores gerados a cima
	                that.__createDivTimeLine(lowerYear, bigYear);
	            }
	        });
    };


    /**
	 * [__createDivTimeLine Realiza a criação dinâmica de todo o componente]
	 * @param  {[Number]} LowerYear [o valor com o menor valor do JSON]
	 * @param  {[Number]} BigYear [o valor com o maior valor do JSON]
	 */
    TimeLine.prototype.__createDivTimeLine = function(lowerYear, bigYear) {
	        //Cria DIV para renderizar o SLIDER do componente           
	        this.__elementDiv = document.createElement('div');
	        this.__elementDiv.id = this.__objMap.objMapName + "_div_timeline";
	        this.__elementDiv.style.width = '100%';
	        document.getElementById(this.__objMap.__map.div.id).appendChild(this.__elementDiv);

	        //Criação do LABEL LOWER do componente
	        this.__elementLabelLower = document.createElement('label');
	        this.__elementLabelLower.id = this.__objMap.objMapName + "_labelLower_timeline";
	        this.__elementLabelLower.style.left = '23%';
	        document.getElementById(this.__elementDiv.id).appendChild(this.__elementLabelLower);
	        document.getElementById(this.__elementLabelLower.id).innerHTML = lowerYear;
	        this.__styleElement(this.__elementLabelLower);
	        
	        //Criação do RANGE do componente
	        this.__elementRange = document.createElement('input');
	        this.__elementRange.id = this.__objMap.objMapName + "_input_timeline";
	        this.__elementRange.style.width = "50%";
	        this.__elementRange.style.left = "25%";
	        this.__elementRange.type = "range";
	        this.__elementRange.value = lowerYear;
	        this.__elementRange.min = lowerYear;
	        this.__elementRange.max = bigYear;
	        document.getElementById(this.__elementDiv.id).appendChild(this.__elementRange);

	        //Criação do LABEL BIG do componente
	        this.__elementLabelBig = document.createElement('label');
	        this.__elementLabelBig.id = this.__objMap.objMapName + "_labelBig_timeline";
	        this.__elementLabelBig.style.left = '77%';
	        document.getElementById(this.__elementDiv.id).appendChild(this.__elementLabelBig);
	        document.getElementById(this.__elementLabelBig.id).innerHTML = bigYear;

	        //Criação do LABEL VALUE ATUAL do componente
	        this.__elementLabelValueAtual = document.createElement('label');
	        this.__elementLabelValueAtual.id = this.__objMap.objMapName + "_labelValueAtual_timeline";
	        this.__elementLabelValueAtual.style.left = '80%';
	        document.getElementById(this.__elementRange.id).appendChild(this.__elementLabelValueAtual);
	        document.getElementById(this.__elementLabelValueAtual.id).innerHTML = " Value Atual: "+ lowerYear;

	        //Estilização da barra de tempo
	        this.__styleElement(this.__elementRange);
	        this.__styleElement(this.__elementLabelBig);
	        this.__styleElement(this.__elementLabelValueAtual);
	        document.getElementById(this.__elementRange.id).onchange= this.__applyFilterChangeValue.bind(this);
    };


	/**
	 * [__applyFilterChangeValue atualiza o valor atual na tela e realiza o filtro de acordo com o valor]
	 * @param  {[Evento]} evt [evento de mudança contendo o valor atual do RANGE]
	 */
	TimeLine.prototype.__applyFilterChangeValue = function(evt) {
			//valor atual do RANGE
            val_actual = evt.target.value;
			//atualização de valor no LABEL
	        document.getElementById(this.__elementLabelValueAtual.id).innerHTML = " Value Atual: " + val_actual;
	        //realização do filtro de acordo com o valor atual do RANGE
			this.__layer.mergeNewParams({
				"CQL_FILTER": this.__columnName + "<=" + val_actual
			});
	};
        
	/**
	 * [__styleElement style padrão para labels | range]
	 * @param  {[Obj]} element [o elemento para que seja atribuido o style padrão]
	 */
    TimeLine.prototype.__styleElement = function (element) {
	        element.style.zIndex = '9999999999';
	        element.style.position = 'absolute';
	        element.style.bottom = '5%';
    };


	/**
	 * [__clear Destrói o parâmetro do filtro CQL_FILTER]
	 */
	TimeLine.prototype.__clear = function() {
			//Zera o valor do CQL_FILTER
			delete this.__layer.params.CQL_FILTER;
			this.__layer.redraw();
	};

	/**
	 * [__destroy Remove a DIV com o componente e destrói o parâmetro do filtro CQL_FILTER]
	 */
	TimeLine.prototype.__destroy = function() {
			//Remove a DIV do componente
			document.getElementById(this.__elementDiv.id).remove();
			console.log("layer: ", this.__layer);
			//
			this.__clear();

	};
	    
	/**
	 * [__show Exibe a linha de tempo]
	 */
	TimeLine.prototype.__show = function() {
			document.getElementById(this.__elementDiv.id).style.opacity = 1;
	};


	/**
	 * [__hide Esconde a linha de tempo]
	 */
	TimeLine.prototype.__hide = function() {
			document.getElementById(this.__elementDiv.id).style.opacity = 0;

	};



	return TimeLine;

});