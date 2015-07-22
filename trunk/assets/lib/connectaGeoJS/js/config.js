//Exemplos para teste das funcionalidades da api
//
//
//config Openlayers API
// Criação do Array de configurações do Openlayers
configOpenlayers = [];

//Config do Mapa
configOpenlayers["Map"] = {
   configMap: {
      type: 'openlayers',
      name: 'mapOpenlayers',
      divMap: 'divMapa',
      projection: 'EPSG:3857',
      initialZoom: '4',
      zoomSlider: false,
      center: {
         x: -47,
         y: -15
      },
      baseLayer: 'All' //Google,Bing,Osm ou All
   },
   configBounds: {
      minX: -47,
      minY: -15,
      maxX: -35,
      maxY: -5
   },
   configSetCenter: {
      point: {
         x: -49.57081,
         y: -16.13026
      },
      zoom: 4
   }
};


//Layers
configOpenlayers["Layers"] = {
   layerWMSESTADOS: {
      type: 'WMS',
      title: 'Layer de TESTE',
      serverUrl: 'http://geobidesenv.cds.com.br/geoserver/wms',
      layer: 'TB_ESTADOS',
      style: 'ESTADOS_POR_REGIAO',
      name: 'ESTADOS',
      divLegend: 'teste',
      filter: ""
   },
   layerWMSREGIOES: {
      type: 'WMS',
      title: 'Layer de TESTE',
      serverUrl: 'http://192.168.2.10:9704/geoserver/wms',
      layer: 'TB_REGIAO',
      style: '',
      name: 'REGIOES',
      divLegend: '',
      filter: ""
   },
   layerWMSPoints: {
      type: 'WMS',
      title: 'Layer de Pontos',
      serverUrl: 'http://geobidesenv.cds.com.br/geoserver/wms',
      layer: 'SHP_PONTOS_TESTE',
      style: '',
      name: 'PONTOS',
      divLegend: 'teste',
      filter: ""

   },
   layerCluster: {
      type: 'Cluster',
      title: 'Layer de Cluster',
      serverUrl: 'http://geobidesenv.cds.com.br/geoserver/wms',
      layer: 'ACOES_PMDB',
      name: 'Cluster',
      filter: "",
      //styleConfig:""      
      styleConfig: [{
         "parameterName": "radius#clusterColor#fontColor#opacity",
         "parameterValue": "22#ffff00#FFFFFF#0.7"
      }, {
         "parameterName": "radius#clusterColor#fontColor#opacity#less#greater",
         "parameterValue": "25#0070c0#FFFFFF#0.7#5#10"
      }, {
         "parameterName": "radius#clusterColor#fontColor#opacity#less#greater",
         "parameterValue": "25#CCCCCC#FFFFFF#0.7#15#35"
      }, {
         "parameterName": "radius#clusterColor#fontColor#opacity",
         "parameterValue": "35#002060#FFFFFF#0.7"
      }]
   },

   layerHeatMap: {
      type: 'HeatMap',
      title: 'Layer de HeatMap',
      serverUrl: 'http://192.168.2.10:9704/geoserver/wms',
      layer: 'ACOES_PMDB',
      name: 'HeatMap',
      filter: "",
      colors: {
         initialColor: "#CCCCCC",
         finalColor: "#0000FF"
      }
   },
   layerMarker: {
      type: 'Marker',
      title: 'Layer de TESTE MARKER',
      name: 'MARKER'
   },
   layerBox: {
      type: 'Box',
      title: 'Layer de TESTE Box',
      name: 'BOX'
   },
   layerArcGIS: {
      type: 'ArcGIS',
      title: 'Layer ARCGIS SERVER',
      serverUrl: 'http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Specialty/ESRI_StateCityHighway_USA/MapServer/export',
      layers: "0,2",
      name: 'ArcGIS Layer'
   },
   layerVector: {
      type: 'Vector',
      title: 'Layer de TESTE VECTOR a partir de outra camada',
      name: 'VECTOR',
      useSourceLayer: true,
      sourceLayer: {
         persistFeatures: false,
         serverUrl: "http://geobidesenv.cds.com.br/geoserver",
         layerName: "TB_PROXIMOS",
         layerNamespace: "http://geobidesenv.cds.com.br/embratel",
         geometryColumn: "GEOM_8307"
            // serverUrl: "http://geobidesenv.cds.com.br/geoserver",
            // layerName: "RODOVIAS_GO",
            // layerNamespace: "http://geobidesenv.cds.com.br/geovernogo",
            // geometryColumn: "GE_4326"
      }
   },
   layerMapviewerWMS: {
      type: 'Mapviewer',
      title: 'Layer Mapviewer',
      serverUrl: 'http://localhost:8080/mapviewer/wms',
      layer: 'TESTE_ESTADOS',
      name: 'ESTADOS',
      datasource: 'wms',
      styleName: 'A.ESTADOS',
      divLegend: 'teste'
   },
   layerMapserver: {
      type: 'Mapserver',
      title: 'Layer Mapserver',
      serverUrl: 'http://localhost:8080/cgi-bin/mapserv.exe',
      layer: 'shp_estados',
      name: 'ESTADOS_MAPSERVER',
      mapFile: '/ms4w/curso_mapserver/mapfiles/estados_wms.map',
      singleTile: false,
      divLegend: 'teste'
   }
};

//Controls
configOpenlayers["Controls"] = {
   controlZB: {
      name: 'ZoomBox',
      type: 'ZoomBox'
   },
   controlLayerSwitcher: {
      name: 'LayerSwitcher',
      type: 'LayerSwitcher'
   },
   controlOverviewMap: {
      name: 'OverviewMap',
      type: 'OverviewMap'
   },
   controlPanZoomBar: {
      name: 'PanZoomBar',
      type: 'PanZoomBar'
   },
   controlScaleLine: {
      name: 'ScaleLine',
      type: 'ScaleLine'
   },
   controlMeasure: {
      name: 'Measure',
      type: 'Measure'
   },
   controlGeolocation: {
      name: 'GeoLocation',
      type: 'GeoLocation'
   },
   controlNavigationHistory: {
      name: 'NavigationHistory',
      type: 'NavigationHistory'
   },
   controlSelectFeature: {
      name: 'SelectFeature',
      type: 'SelectFeature',
      layerName: 'VECTOR'
   },
   controlDragFeature: {
      name: 'DragFeature',
      type: 'DragFeature',
      layerName: 'VECTOR'
   },
   controlDrawFeature: {
      name: 'DrawFeature',
      type: 'DrawFeature',
      drawType: 'Point', //Point,Line,Polygon,Box
      layerName: 'VECTOR'
   },
   controlModifyFeature: {
      name: 'ModifyFeature',
      type: 'ModifyFeature',
      layerName: 'VECTOR'
   },
   controlSpatialFilter: {
      name: 'SpatialFilter',
      type: 'SpatialFilter'
   },
   controlDeleteFeature: {
      name: 'DeleteFeature',
      type: 'DeleteFeature',
      layerName: 'VECTOR'
   },
   controlInfo: {
      name: 'WMSInfo',
      type: 'WMSInfo',
      title: 'Informações',
      serverUrl: 'http://geobidesenv.cds.com.br/geoserver/wms'
   },
   controlRoute: {
      name: 'Route Control',
      type: 'Route'
   },
   controlSwipe: {
      name: 'Swipe Control',
      type: 'Swipe',
      //layerName: 'Cluster',
      //layerName2: 'HeatMap'
      layerName: 'ESTADOS',
      layerName2: 'ESTADOS_MAPSERVER'
   },
   controlMouseCoords: {
      name: 'Mouse Coords Control',
      type: 'MouseCoords'
   },
   controlInfoFeature: {
      name: 'Info Feature',
      type: 'InfoFeature',
      layerName: 'VECTOR'
   }

};


//Features
configOpenlayers["Features"] = {
   featurePoint: {
      type: 'Point',
      x: -45,
      y: -15
   },
   featureLine: {
      type: 'Line',
      points: {
         p1: {
            x: -45,
            y: -15
         },
         p2: {
            x: -40,
            y: -10
         }
      },
      featureStyle: {
         graphicHeight: 16,
         stroke: 12,
         strokeColor: "red",
         strokeWidth: 10,
         strokeOpacity: 0.5
      }

   },
   featurePolygon: {
      type: 'Polygon',
      points: {
         p1: {
            x: -45,
            y: -15
         },
         p2: {
            x: -40,
            y: -10
         },
         p3: {
            x: -20,
            y: -5
         }
      },
      featureStyle: {
         stroke: 30,
         graphicWidth: 16,
         strokeColor: "red",
         strokeWidth: 100,
         strokeOpacity: 0.5
      }

   }
};


//Markers
configOpenlayers["Markers"] = {
   Marker: {
      coords: {
         x: -45,
         y: -15
      },
      size: {
         width: 21,
         height: 25
      },
      iconURL: 'http://www.openlayers.org/dev/img/marker.png'
   },
   Box: {
      point1: {
         x: -47,
         y: -15
      },
      point2: {
         x: -35,
         y: -5
      }
   }
};



//Config ESRI JS API
// Criação do Array de configurações da ESRI
configESRI = [];

//Config do Mapa
configESRI["Map"] = {
   configMap: {
      type: 'esri',
      name: 'mapESRI',
      divMap: 'divMapa',
      projection: 'EPSG:3857',
      initialZoom: '4',
      coordsMERCATOR: false, //padrão do mapa true || false (lat / long)
      zoomSlider: false, //Barra de Zoom true || false
      center: {
         x: -47,
         y: -15
      },
      auth: {
         user: 'CDS_CVA_GEO',
         password: 'cvageo123'
      }
   },
   configSetCenterWGS: {
      point: {
         x: -49.57081,
         y: -16.13026
      },
      spatialReference: 4326
   },
   configSetCenterUTM: {
      point: {
         x: -5518197.327410021,
         y: -1819812.5362559436
      },
      spatialReference: 3857
   },
   configExtentWGS: {
      xmin: -47,
      ymin: -15,
      xmax: -35,
      ymax: -5,
      spatialReference: 4326
   },
   configExtentUTM: {
      xmin: -5518197.327410021,
      ymin: -1819812.5362559436,
      xmax: -6018197.327410021,
      ymax: -2019812.5362559436,
      spatialReference: 3857

   }

};


//Layers
configESRI["Layers"] = {
   layerFeature25: {
      type: 'Feature',
      name: 'Feature 25',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/BaixoCai/MapServer/11',
      useLegend: true
   },
   layerFeature50: {
      type: 'Feature',
      name: 'Feature 50',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/BaixoCai/MapServer/12'
   },
   layerFeature100: {
      type: 'Feature',
      name: 'Feature 100',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/BaixoCai/MapServer/13'
   },

   layerDynamicMapService: {
      type: 'DynamicMapService',
      name: 'Dynamic Map ESRI',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/BaixoCai/MapServer'
   },
   layerFeature: {
      type: 'Feature',
      name: 'Feature Layer',
      layerURL: 'http://services2.arcgis.com/VCZhazNjTllBDhrB/arcgis/rest/services/AGENCIAS/FeatureServer/1',
      userLegend: true,
      nameLegend: 'legendDiv'
   },
   layerFeature2: {
      type: 'Feature',
      name: 'Feature Layer',
      layerURL: 'http://services2.arcgis.com/VCZhazNjTllBDhrB/ArcGIS/rest/services/Rodovias_DF/FeatureServer/0'
   },
   layerGraphic: {
      type: 'Graphics',
      name: 'Graphics Layer'
   },
   layerCluster: {
      type: 'Cluster',
      name: 'Cluster Layer',
      layerURL: 'http://services2.arcgis.com/VCZhazNjTllBDhrB/arcgis/rest/services/AGENCIAS/FeatureServer/1'
   },
   layerHeatMap: {
      type: 'HeatMap',
      name: 'HeatMap Layer',
      layerURL: 'http://services2.arcgis.com/VCZhazNjTllBDhrB/arcgis/rest/services/AGENCIAS/FeatureServer/1'
   },
   layerWMSGeoserver: {
      type: 'WMS',
      title: 'Layer de Teste GEOSERVER',
      serverUrl: 'http://geobidesenv.cds.com.br/geoserver/wms',
      layer: 'estados_mira',
      style: '',
      name: 'ESTADOS MIRA GEOSERVER',
      divLegend: 'teste'
   },
   layerBaseLayer: {
      layerUrl: 'http://arcgis.cds.com.br/arcgis/rest/services/UF_Brasil/MapServer',
      title: 'Gato a jato'
   },
   layerAgsRaster: {
      layerUrl: 'http://ags.servirlabs.net/ArcGIS/rest/services/ReferenceNode/TRMM_30DAY/MapServer',
      title: 'Raster Layer'
   },
   layerArcGISTimeLine: {
      type: 'DynamicMapService',
      title: 'Layer ARCGIS SERVER TIME LINE',
      layerURL: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Petroleum/KSWells/MapServer/0',
      name: 'ArcGIS Layer Time Line'
   },
   layerESRIWMS: {
      type: 'ESRIWMS',
      name: 'ESRI WMS',
      layerURL: 'http://192.168.4.16:6080/arcgis/services/METROPLAN/SDE_FOLHA_SECA_dinamico/ImageServer/WMSServer'
   },
   layerArcGISImageService: {
      type: 'ArcGISImageService',
      name: 'ESRI IMAGE',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/SDE_FOLHA_SECA_dinamico/ImageServer'
   },
   layerArcGISTiledMapServiceLayer: {
      type: 'ArcGISTiledMapService',
      name: 'ESRI TILE IMAGE',
      layerURL: 'http://192.168.4.16:6080/arcgis/rest/services/METROPLAN/SDE_DID_F_PRMD_CACHE/ImageServer'
   },
   layerWMSMapviewer: {
      type: 'WMS',
      title: 'Layer de Teste Mapviewer',
      serverUrl: 'http://localhost:8080/mapviewer/wms',
      layer: 'TESTE_ESTADOS',
      datasource: 'wms',
      name: 'ESTADOS_MAPVIEWER',
      styleName: 'A.ESTADOS',
      divLegend: 'teste'
   },
   layerWMSMapserver: {
      type: 'WMS',
      title: 'Layer de Teste Mapserver',
      serverUrl: 'http://localhost:8080/cgi-bin/mapserv.exe',
      mapFile: '/ms4w/curso_mapserver/mapfiles/estados_wms.map',
      layer: 'shp_estados',
      name: 'ESTADOS MAPSERVER',
      divLegend: 'teste'
   }
};

//Graphics
configESRI["Graphics"] = {
   graphicPoint: {
      type: 'Point',
      x: -45,
      y: -15
   },
   graphicLine: {
      type: 'Line',
      points: {
         p1: {
            x: -45,
            y: -15
         },
         p2: {
            x: -40,
            y: -10
         }
      }
   },
   graphicPolygon: {
      type: 'Polygon',
      points: {
         p1: {
            x: -45,
            y: -15
         },
         p2: {
            x: -40,
            y: -10
         },
         p3: {
            x: -20,
            y: -5
         }
      }
   }
};


//Components
configESRI["Components"] = {
   baseMapGalleryComponent: {
      type: 'BaseMapGallery',
      name: 'BaseMapGallery',
      div: 'basemapGallery',
      useArcGISBasemaps: true
   },
   drawComponent: {
      type: 'Draw',
      name: 'Draw Component',
      layerName: ''
   },
   measureComponent: {
      type: 'Measure',
      name: 'Measure Component',
      div: 'measureDiv'
   },
   overviewComponent: {
      type: 'OverviewMap',
      name: 'Overview'
   },
   spatialFilterComponent: {
      type: 'SpatialFilter',
      name: 'SpatialFilter Component'
   },
   scalebarComponent: {
      type: 'ScaleBar',
      name: 'ScaleBar'
   },
   GeoLocationComponent: {
      type: 'GeoLocation',
      name: 'GeoLocation'
   },
   RouteComponent: {
      type: 'Route',
      name: 'Route'
   },
   GeocoderComponent: {
      type: 'Geocoder',
      name: 'Geocoder'
   },
   editComponent: {
      type: 'Edit',
      name: 'Edit Component',
      layerName: 'Graphics Layer'
   },
   traceComponent: {
      type: 'Trace',
      name: 'Trace Component',
      serviceURL: 'http://elevation.arcgis.com/arcgis/rest/services/Tools/Hydrology/GPServer/TraceDownstream'
   },
   editFeatureComponent: {
      type: 'EditFeature',
      name: 'Edit Feature Component'
   },
   swipeComponent: {
      type: 'Swipe',
      name: 'Swipe Layer Component',
      layerName: 'Feature Layer',
      swipeType: 'vertical' //"scope" | "horizontal" | "vertical"
   },
   timeLine: {
      type: 'TimeLine',
      name: 'Edit Feature Component',
      dataInicial: '1/1/1921 UTC',
      dataFinal: '12/31/2009 UTC',
      numberThumb: 1,
      valorInicialThum: 1,
      intervaloTempo: 2,
      tempoPlay: 2000
   },
   printMapComponent: {
      type: 'PrintMap',
      name: 'Componente de Impressão',
      div: 'basemapGallery',
      printURL: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export Web Map Task'
   },
   bufferComponent: {
      type: 'Buffer',
      name: 'Buffer Component'
   }
};

//CONFIG ESPECIAL, PARA TESTE DA FUNCIONALIDADE DE CONTROLE DE MOUSE COORDS DO OPENLAYERS
configStyle = [];
configStyle["left"] = "40%";
configStyle["fontSize"] = "15px";
configStyle["bottom"] = "2em";