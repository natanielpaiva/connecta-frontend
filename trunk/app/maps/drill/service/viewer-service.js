define([
    'connecta.maps',
    'maps/drill/service/menu-service'
], function (maps) {
    return maps.lazy.service('ViewerServiceDrill', function (mapsResources, MenuServiceDrill, $http) {

        this.getViewerConfig = function (layerViewer, map) {

            //LayerViewerConfig
            var layerViewerConfig = {
                layerViewer: layerViewer,
                name: layerViewer.nm_viewer,
                layerName: layerViewer.layerEntity.nm_layer,
                title: layerViewer.layerEntity.nm_layer,
                serverUrl: layerViewer.layerEntity.layerSourceEntity.ds_link_interno,
                type: layerViewer.layerViewerTypeEntity.id,
                implType: layerViewer.viewerTypeImplEntity.id,
                filter: layerViewer.filter
            };


            var configLayer = this.createAnalysisViewer(layerViewerConfig);
            console.info("ANALYSIS VIEWER", configLayer);
            MenuServiceDrill.renderMenu(layerViewerConfig, map);
            this.renderViewer(configLayer, map);

        };

        this.createAnalysisViewer = function (configViewer) {
            //Cria div para renderizar a legenda
            this.__element = document.createElement('div');
            this.__element.id = configViewer.name + 'Legend';
            document.getElementById("map-view-drill").appendChild(this.__element);
            this.__element.style.float = 'right';
            this.__element.style.bottom = '30px';
            this.__element.style.position = 'absolute';
            this.__element.style.zIndex = '9999';

            var params = configViewer.layerViewer.ds_param_values.split('#');

            //Default
            return {
                type: 'WMS',
                title: configViewer.title,
                serverUrl: configViewer.serverUrl + "/wms",
                layer: configViewer.layerName,
                style: params[0],
                name: configViewer.name,
                divLegend: this.__element.id,
                filter: configViewer.filter
            };


        };


        this.renderViewer = function (configLayer, map) {
            var interval = setInterval(function () {
                if (typeof map !== 'undefined') {
                    map.__createLayer(configLayer);

                    //Correção paleativa para bug de base layer do Google
                    map.__map.setBaseLayer(map.__map.getLayersByName("OpenStreetMap Base Layer")[0]);

                    if (map.__map.getZoom() < 6) {
                        map.__zoomMapToMaxExtent();
                        map.__map.zoomIn();

                    }

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
