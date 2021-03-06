/* global angular */
define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço de utilitários
     */
    return portal.service('util', function(){
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
        
        this.mapToArray = function(map, keyPropertyName) {
            if (!keyPropertyName) {
                keyPropertyName = 'id';
            }
            var array = [];
            angular.forEach(map, function (value, key) {
                value[keyPropertyName] = key;
                array.push(value);
            });
            return array;
        };

        this.formatNumber = function(number, decimalsLength, decimalSeparator, thousandSeparator) {
           var n = number,
               dl = isNaN(decimalsLength = Math.abs(decimalsLength)) ? 2 : decimalsLength,
               ds = decimalSeparator === undefined ? "," : decimalSeparator,
               ts = thousandSeparator === undefined ? "." : thousandSeparator,
               sign = n < 0 ? "-" : "",
               i = parseInt(n = Math.abs(+n || 0).toFixed(dl)) + "",
               j = (j = i.length) > 3 ? j % 3 : 0;

           return sign +
               (j ? i.substr(0, j) + ts : "") +
               i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + ts) +
               (dl ? (ds + Math.abs(n - i).toFixed(dl).slice(2)).replace(/\,0+$/,'') : "");
        };

    });
});



