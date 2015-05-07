define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerViewerService', function (mapsResources, $http) {
        this.get = function(id){
            var url = mapsResources.layerViewer + "/" + id;
            return $http.get(url);
        };
        
        
        this.list = function(){
            var url = mapsResources.layerViewer;
            return $http.get(url);
        };
        
        
        this.save = function(layerSource){
            return $http.post(mapsResources.layerViewer, layerSource);
        };
        
        this.delete = function(id){
            var url = mapsResources.layerViewer + '/' + id;
            return $http.delete(url);
        };
        
    });
});