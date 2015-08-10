define([
    'connecta.portal',
    'angular'
], function (portal, angular) {
    /**
     * Serviço de gerenciamento das aplicações diversas (presenter, collector, etc)
     * @param {object} $http
     */
    return portal.lazy.factory('$autocomplete', function ($http) {
        return function(resource, parameters){
            var params = {
                page:1,
                count:5
            };
            
            angular.extend(params, parameters);
            
            return $http.get(resource, {
                params: params
            });
        };
    });
});



