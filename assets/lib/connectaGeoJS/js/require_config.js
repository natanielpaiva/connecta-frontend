// config do require js
require.config({
   //baseUrl: 'bower_components/connectaGeoJS/index/',
   paths: {
      async: 'bower_components/connectaGeoJS/index/openlayersImplementation/async/async',
      openlayers: 'bower_components/connectaGeoJS/index/openlayersImplementation/openlayers-api/OpenLayers-2.13.1/OpenLayers',
      googleMaps: '//maps.googleapis.com/maps/api/js?sensor=false&region=br',
      // Alias for CSS plugin
      css: 'bower_components/connectaGeoJS/index/css',
      heatmap: 'esriImplementation/heatmap-api/heatmap',
      heatmapArcgis: 'esriImplementation/heatmap-api/heatmap-arcgis',
      jklDumper: 'bower_components/connectaGeoJS/index/utils/jkl-dumper',
      ObjTree: 'bower_components/connectaGeoJS/index/utils/ObjTree',
      colorComponent: 'bower_components/connectaGeoJS/index/utils/colorComponent'
   },
   packages: [{
      name:'dojo',
      main :'./main',      
      location: 'esriImplementation/dojo/dojo'
   },
   {
      name:'dijit',
      main :'./main',      
      location: 'esriImplementation/dojo/dijit'
   },
   {
      name:'dojox',
      main :'./main',      
      location: 'esriImplementation/dojo/dojox'
   },
   {
      name:'esri',
      main :'main',      
      location: 'http://js.arcgis.com/3.8compact/js/esri'
   }

   ]
});