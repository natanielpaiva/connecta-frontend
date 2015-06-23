define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('LayerViewerService', function (mapsResources, $http) {

        var typeConfig = {
            "1": {
                name: 'LAYERVIEWER.DEFAULT',
                template: 'app/maps/layer-viewer/template/_layer-viewer-default.html',
                icon: 'icon-default'
            },
            "2": {
                name: 'LAYERVIEWER.HEATMAP',
                template: 'app/maps/layer-viewer/template/_layer-viewer-heatmap.html',
                icon: 'icon-heatmap'
            },
            "3": {
                name: 'LAYERVIEWER.CLUSTER',
                template: 'app/maps/layer-viewer/template/_layer-viewer-cluster.html',
                icon: 'icon-cluster'
            },
            "4": {
                name: 'LAYERVIEWER.ANALYSIS',
                template: 'app/maps/layer-viewer/template/_layer-viewer-analisys.html',
                icon: 'icon-analisys'
            }
            
        };
        
        
        this.createStyle = function (formData) {

            var url = mapsResources.geo + "/createStyle";

            $http.post(url, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                //TODO notificação de sucesso
                console.info("Estilo criado com sucesso", data);                
            }).error(function(data){
                //TODO notificação de sucesso
                
                console.info("ERRO NA Criação do estilo", data);                
            });

        };
        
        
                
        this.get = function (id) {
            var url = mapsResources.layerViewer + "/" + id;
            return $http.get(url);
        };


        this.getById = function (id) {
            var url = mapsResources.layerViewer + '/' + id;
            return $http.get(url);
        };


        this.getTypes = function () {
            return typeConfig;
        };

        this.list = function () {
            var url = mapsResources.layerViewer;
            return $http.get(url);
        };


        this.save = function (layerSource) {
            return $http.post(mapsResources.layerViewer, layerSource);
        };

        this.delete = function (id) {
            var url = mapsResources.layerViewer + '/' + id;
            return $http.delete(url);
        };
                        
    });
});