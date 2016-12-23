define([], function() {

	var ModifyFeatureControl = function(configModifyFeature) {
		Function.apply(this);

		//Construtor                    		
		this.__control = new OpenLayers.Control.ModifyFeature(configModifyFeature.MAP.__getLayerByName(configModifyFeature.layerName).__layerObj.__layer);                
	};

	ModifyFeatureControl.prototype = new Function();
	ModifyFeatureControl.prototype.construtor = ModifyFeatureControl;


        /**
        * [__changeControlModify Muda o tipo de edição da feature]
        * * @param  {[STRING]} typeModifyFeature [Valor do tipo de edição o controle receberá]
        * RESHAPE | RESIZE | ROTATE | DRAG
        */
        ModifyFeatureControl.prototype.__changeControlModify = function (typeModifyFeature) {
            this.__control.mode = eval("OpenLayers.Control.ModifyFeature." + typeModifyFeature);
        };
        
	return ModifyFeatureControl;

});