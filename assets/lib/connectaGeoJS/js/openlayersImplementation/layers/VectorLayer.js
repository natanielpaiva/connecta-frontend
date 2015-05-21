define([ConnectaGeoConfig.baseURL+'openlayersImplementation/Feature'], function(Feature) {

    var VectorLayer = function(configLayer) {
        Function.apply(this);

        //Construtor
        this.renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
        this.renderer = (this.renderer) ? [this.renderer] : OpenLayers.Layer.Vector.prototype.renderers;



        // saveControl.events.register("success", '', function(args){console.info("SUCCESS",args);});
        // saveControl.events.register("failure", '', function(args){console.info("Failure",args);});


        //Verifica se a camada de vetor vai ser gerada a partir de uma camada já existente

        if (configLayer.useSourceLayer) {


            this.__layerStrategies = [];
            this.__layerStrategies.push(new OpenLayers.Strategy.BBOX());            

            //Verifica se utilizará WFS-t para persistir os dados
            if (configLayer.sourceLayer.persistFeatures) {
                this.__persistControl = new OpenLayers.Strategy.Save();
                this.__layerStrategies.push(this.__persistControl);
            }



            //CRIANDO UMA CAMADA WFS            
            this.__layer = new OpenLayers.Layer.Vector(configLayer.title, {
                // strategies: [new OpenLayers.Strategy.Fixed(), saveControl],
                strategies: this.__layerStrategies,
                projection: configLayer.MAP.__map.getProjection(),
                protocol: new OpenLayers.Protocol.WFS({
                    version: "1.1.0",
                    srsName: configLayer.MAP.__map.getProjection(),
                    url: configLayer.sourceLayer.serverUrl + "/wfs",
                    featureNS: configLayer.sourceLayer.layerNamespace,
                    featureType: configLayer.sourceLayer.layerName,
                    geometryName: configLayer.sourceLayer.geometryColumn,
                    schema: configLayer.sourceLayer.serverUrl + "/wfs/DescribeFeatureType?version=1.1.0&typename=" + configLayer.sourceLayer.layerName
                }),
                renderers: this.renderer
            });


        } else {


            this.__layer = new OpenLayers.Layer.Vector(configLayer.title, {
                renderers: this.renderer
            });

        }

        this.__objFeatures = [];
        this.__objMap = configLayer.MAP;

    };

    VectorLayer.prototype = new Function();
    VectorLayer.prototype.construtor = VectorLayer;



    /**
     * [__createFeature Criar Feature]
     * @param  {[JSON]} config [Config da Feature a ser criada]
     */
    VectorLayer.prototype.__createFeature = function(config) {
        config['MAP'] = this.__objMap;
        var feature = new Feature(config);
        this.__addFeature(feature.__feature);

    };


    /**
     * [__createFeature Adiciona feature na layer]
     * @param  {[Openlayers.Feature.Vector]} feature [Feature]
     */
    VectorLayer.prototype.__addFeature = function(feature) {
        this.__layer.addFeatures([feature]);
        this.__objFeatures.push(feature);

    };


    /**
     * [__removeFeature Remove feature da layer]
     * @param  {[Openlayers.Feature.Vector]} feature [Feature]
     */
    VectorLayer.prototype.__removeFeature = function(feature) {

        var id = feature.id;
        var feature = this.__layer.getFeatureById(id);
        this.__layer.removeFeatures(feature);
        var index = this.__objFeatures.indexOf(feature);
        this.__objFeatures.splice(index, 1);


    };



    /**
     * [__removeAllFeatures Remove todas as  features da layer]
     */
    VectorLayer.prototype.__removeAllFeatures = function() {
        this.__objFeatures = [];
        this.__layer.removeAllFeatures();
    };


    /**
     * [__commitChanges Processa as alterações na camada]
     */
    VectorLayer.prototype.__commitChanges = function() {
        this.__persistControl.save();
    }

    return VectorLayer;


});