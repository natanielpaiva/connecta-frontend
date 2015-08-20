define([], function() {

	var MouseCoordsControl = function() {
		Function.apply(this);

		//Construtor		
		this.__control = new OpenLayers.Control.MousePosition({
                        prefix: 'Coordinates: ',
                        separator: ' | ',
                        numDigits: 3,
                        emptyString: 'Mouse is not over map.'
                    });    
                    
	};                                

	MouseCoordsControl.prototype = new Function();
	MouseCoordsControl.prototype.construtor = MouseCoordsControl;
        
        MouseCoordsControl.prototype.__changeStyle = function(styleConfig){
                        
            //realiza a iteração do Array, para gerar as propriedades do estilo            
            for(var prop in styleConfig){                
                this.__control.div.style[prop] = styleConfig[prop];                
            }
            
        };

	return MouseCoordsControl;


});