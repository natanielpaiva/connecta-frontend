define([
    'connecta.portal'
], function (portal) {
    /**
     * Serviço que gera UUIDs
     * @param {object} $http
     */
    return portal.lazy.factory('uuid', function(){
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        
        return function(){
            return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
        };
    });
});



