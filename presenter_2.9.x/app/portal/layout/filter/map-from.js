define([
    'connecta.portal'
], function(portal) {
    
    return portal.filter('mapFrom', function($log) {
        return function(input, map) {
            var out = "";
            $log.info('map from',input);
            for (var a in map) {
                if (!map.hasOwnProperty(a)) {
                    continue;
                }
                if (a + '' === input + '') {
                    out = map[a];
                }
            }
            return out;
        };
    });

});
