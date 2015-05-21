define([
    'connecta.maps'
], function (maps) {
    return maps.lazy.service('ViewerService', function (mapsResources, $http) {

        this.getViewerConfig = function (layerViewer, map) {

            //LayerViewerConfig
            var layerViewerConfig = {
                layerViewer: layerViewer,
                name: layerViewer.nm_viewer,
                layerName: layerViewer.layerEntity.nm_layer,
                title: layerViewer.layerEntity.nm_layer,
                serverUrl: layerViewer.layerEntity.layerSourceEntity.ds_link_interno,
                type: layerViewer.layerViewerTypeEntity.id,
                implType: layerViewer.viewerTypeImplEntity.id
            };

            var configLayer = "";
            switch (layerViewerConfig.type) {
                case 1:

                    configLayer = this.createDefaultViewer(layerViewerConfig);
                    break;
                case 2:
                    configLayer = this.createHeatmapViewer(layerViewerConfig);
                    break;
                case 3:
                    configLayer = this.createClusterViewer(layerViewerConfig);
                    break;
            }

            this.renderViewer(configLayer, map);

        };


        this.createDefaultViewer = function (configViewer) {
            //Cria div para renderizar a legenda
            this.__element = document.createElement('div');
            this.__element.id = configViewer.divName + 'Legend';
            document.getElementById("map-view").appendChild(this.__element);
            this.__element.style.float = 'right';
            this.__element.style.bottom = '20px';
            this.__element.style.left = '20px';
            this.__element.style.position = 'absolute';
            this.__element.style.zIndex = '9999';



            //Default
            return {
                type: 'WMS',
                title: configViewer.title,
                serverUrl: configViewer.serverUrl + "/wms",
                layer: configViewer.layerName,
                style: configViewer.layerViewer.ds_param_values,
                name: configViewer.name,
                divLegend: this.__element.id,
                filter: ""
            };


        };



        this.createHeatmapViewer = function (configViewer) {

            //HeatMap        
            var colors = configViewer.layerViewer.ds_param_values.split("~");
            return {
                type: 'HeatMap',
                title: configViewer.title,
                serverUrl: configViewer.serverUrl + "/wms",
                layer: configViewer.layerName,
                name: configViewer.name,
                filter: "",
                colors: {
                    initialColor: colors[0],
                    finalColor: colors[1]
                }
            };
        };



        this.createClusterViewer = function (configViewer) {
//           var config = configViewer.layerViewer.ds_param_values.replace(/~/gi, "");
           var config = configViewer.layerViewer.ds_param_values;
           // var config = "16#b50404#e03b3b#25@17#ff6300#c92121#35#1#9@21#b11818#f8843c#35#10#13@12#b41e73#bd1313#75#14#15@12#ff0000#dabb34#65#3";
            var clusterParams = [];
            var jsonConfig = config.split('@');
            var qtdInterval = parseInt(jsonConfig[jsonConfig.length - 1].substr(jsonConfig[jsonConfig.length - 1].lastIndexOf("~") + 1));
            //Initial
            clusterParams.push({
                "parameterName": "radius#clusterColor#fontColor#opacity",
                "parameterValue": jsonConfig[0]
            });
            //Intervals
            for (var i = 1; i < qtdInterval + 1; i++) {
                clusterParams.push({
                    "parameterName": "radius#clusterColor#fontColor#opacity#less#greater",
                    "parameterValue": jsonConfig[i]
                });
            }

            //Final
            clusterParams.push({
                "parameterName": "radius#clusterColor#fontColor#opacity",
                "parameterValue": jsonConfig[qtdInterval - 1]
            });
            // goiaba2= goiaba.replace(/~/gi,"");

            //Cluster
            return {
                type: 'Cluster',
                title: configViewer.title,
                serverUrl: configViewer.serverUrl + "/wms",
                layer: configViewer.layerName,
                name: configViewer.name,
                filter: "",
               // styleConfig: ""
               styleConfig: clusterParams
            };
        };


        this.renderViewer = function (configLayer, map) {
            var interval = setInterval(function () {
                if (typeof map !== 'undefined') {
                    map.__createLayer(configLayer);
                    clearInterval(interval);
                }
            });
        };

    });
});