define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('DrillService', function (mapsResources, $http) {

        
        this.get = function(id){
            var url = mapsResources.drill + "/" + id;
            return $http.get(url);
        };
        
        this.list = function (params) {
            var url = mapsResources.drill;
            return $http.get(url, {params: params});
        };
        
        this.save = function (drill) {            
            var url = mapsResources.drill;            
            return $http.post(url, drill);
        };
        
        this.delete = function(id){
            var url = mapsResources.drill + '/' + id;
            return $http.delete(url);
        };
        
    });
});
