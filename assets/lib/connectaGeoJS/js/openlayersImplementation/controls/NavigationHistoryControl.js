define([], function() {

	var NavigationHistoryControl = function() {
		Function.apply(this);

		//Construtor
		//		this.__control = new OpenLayers.Control.LayerSwitcher();
		this.__control = new OpenLayers.Control.NavigationHistory();

		this.__control.events.on({
			"deactivate": this.__clearHistory.bind(this)
		});

	};

	NavigationHistoryControl.prototype = new Function();
	NavigationHistoryControl.prototype.construtor = NavigationHistoryControl;


	/**
	 * [__clearHistory Limpa o histórico de visualizações do controle]
	 */
	NavigationHistoryControl.prototype.__clearHistory = function() {
		this.__control.clear();
	};



	/**
	 * [__nextView Próxima visualização do Mapa]
	 */
	NavigationHistoryControl.prototype.__nextView = function() {
		this.__control.nextTrigger();

	};


	/**
	 * [__previousView Visualização anterior do Mapa]
	 */	
	NavigationHistoryControl.prototype.__previousView = function() {
		this.__control.previousTrigger();

	};

	return NavigationHistoryControl;

});