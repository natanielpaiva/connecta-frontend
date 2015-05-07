define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerService', function (mapsResources, $http) {
        this.get = function(id){
            var url = mapsResources.layer + "/" + id;
            return $http.get(url);
        };
        
        
        this.list = function(){
            var url = mapsResources.layer;
            return $http.get(url);
        };
        
        
        this.save = function(layer){
            return $http.post(mapsResources.layer, layer);
        };
        
        this.delete = function(id){
            var url = mapsResources.layer + '/' + id;
            return $http.delete(url);
        };
        
    });
});