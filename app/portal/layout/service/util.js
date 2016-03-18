define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de utilitários
     */
    return portal.lazy.service('util', function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        
        this.uuid = function(){
            return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
        };
        
        this.randomRgbColor = function(rgb){
            if (rgb) {
                return 'rgb('+
                    Math.round(Math.random()*255)+
                    ','+
                    Math.round(Math.random()*255)+
                    ','+
                    Math.round(Math.random()*255)+
                    ')';
            } else {
                return '#'+this.rgbToHex(
                    Math.round(Math.random()*255),
                    Math.round(Math.random()*255),
                    Math.round(Math.random()*255)
                );
            }
        };
        
        this.rgbToHex = function(red, green, blue){
            var decColor = red + 256 * green + 65536 * blue;
            return decColor.toString(16);
        };
    });
});



