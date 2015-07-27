define([
    'connecta.maps',
    'maps/layer-viewer-group/service/menu-service',
    'maps/layer-viewer/service/layer-viewer-service'
], function (maps) {
    return maps.lazy.service('ViewerService', function (mapsResources, MenuService, LayerViewerService, $http) {

        this.getViewerConfig = function (layerViewerGroup, map) {

            var layerViewers = layerViewerGroup.ds_viewers.split("#");
            var objViewers = null;
            var layerViewerConfig = null;
            var configLayer = "";
            var that = this;
            var lol = 0;
            for (var layerViewer in layerViewers) {
                // servico que retorna os visualizadores
                LayerViewerService.get(layerViewers[layerViewer]).then(function (data) {

                    objViewers = data.data;

                    // preparacao do objeto para mandar para o renderizador
                    layerViewerConfig = {
                        layerViewer: objViewers,
                        name: objViewers.nm_viewer,
                        layerName: objViewers.layerEntity.nm_layer,
                        title: objViewers.layerEntity.nm_layer,
                        serverUrl: objViewers.layerEntity.layerSourceEntity.ds_link_interno,
                        type: objViewers.layerViewerTypeEntity.id,
                        implType: objViewers.viewerTypeImplEntity.id
                    };

                    // tipo de layer
                    switch (layerViewerConfig.type) {
                        case 1:

                            configLayer = that.createDefaultViewer(layerViewerConfig);
                            break;
                        case 2:
                            configLayer = that.createHeatmapViewer(layerViewerConfig);
                            break;
                        case 3:
                            configLayer = that.createClusterViewer(layerViewerConfig);
                            break;
                    }

                    // renderizar a layer
                    that.renderViewer(configLayer, map);
                    
//                    if (lol < 1) {
                        // rederizar o menu
                        MenuService.renderMenu(layerViewerConfig, map);
//                        ++lol;
//                    }

                });
            }
        };


        this.createDefaultViewer = function (configViewer) {
            //Cria div para renderizar a legenda
            this.__element = document.createElement('div');
            this.__element.id = configViewer.name + 'Legend';
            document.getElementById("map-view").appendChild(this.__element);
            this.__element.style.float = 'right';
            this.__element.style.bottom = '30px';
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
                    "parameterValue": jsonConfig[i].substring(1)
                });
            }

            //Final
            clusterParams.push({
                "parameterName": "radius#clusterColor#fontColor#opacity",
                "parameterValue": jsonConfig[qtdInterval + 1].substring(1)
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

                    if (configLayer.type === 'WMS') {
                        var controlInfo = {
                            name: 'WMSInfo',
                            type: 'WMSInfo',
                            title: 'Informações',
                            serverUrl: configLayer.serverUrl
                        };
                        var controlSpatialFilter = {
                            name: 'SpatialFilter',
                            type: 'SpatialFilter'
                        };
                        //Create Controls for WMS
                        map.__createControl(controlInfo);
                        map.__createControl(controlSpatialFilter);
                    }


                    clearInterval(interval);
                }
            });
        };

    });
});
