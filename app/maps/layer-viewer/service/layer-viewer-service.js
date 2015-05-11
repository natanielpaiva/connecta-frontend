define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerViewerService', function (mapsResources, $http) {
        
        var typeConfig = {
            "1": {
                name: 'Default',
                template: 'app/maps/layer-viewer/template/_layer-viewer-default.html',
                icon:'icon-default'
            },
            "2": {
                name: 'Heatmap',
                template: 'app/maps/layer-viewer/template/_layer-viewer-heatmap.html',
                icon:'icon-heatmap'
            },
            "3": {
                name: 'Cluster',
                template: 'app/maps/layer-viewer/template/_layer-viewer-cluster.html',
                icon:'icon-cluster'
            }
        };
        
        this.get = function(id){
            var url = mapsResources.layerViewer + "/" + id;
            return $http.get(url);
        };
        
        
        this.getById = function (id) {
            var url = mapsResources.layerViewer + '/' + id;
            return $http.get(url);
        };
        
        
        this.getTypes = function() {
            return typeConfig;
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