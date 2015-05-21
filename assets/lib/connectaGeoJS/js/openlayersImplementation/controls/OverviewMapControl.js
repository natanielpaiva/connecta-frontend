define([], function() {

	var OverviewMapControl = function() {
		Function.apply(this);

		//Construtor		
		this.__control = new OpenLayers.Control.OverviewMap({
			maximized: true,
			maximizeTitle: 'Exibe  a visão geral',
			minimizeTitle: 'Esconde a visão geral'
		});

	};

	OverviewMapControl.prototype = new Function();
	OverviewMapControl.prototype.construtor = OverviewMapControl;

	return OverviewMapControl;


});