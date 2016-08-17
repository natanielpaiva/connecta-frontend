define([], function() {

    //Descritor das implementações dos métodos dos mapas
    var AbstractLayer = function() {
        Function.apply(this);

    };

    AbstractLayer.prototype = new Function();
    AbstractLayer.prototype.construtor = AbstractLayer;


    /**
     * [__createLayer Método para criar camada de acordo com o tipo]
     * @param  {[JSON]} configLayer [Config da layer a ser criada]
     */
    AbstractLayer.prototype.__createLayer = function(configLayer) {
        console.error("Method not implemented");
    };


    /**
     * [__getLayerVisibility Retorna a visibilidade da layer]
     * @param  {[Boolean]} boolean [Visibilidade da layer true | false]
     */
    AbstractLayer.prototype.__getLayerVisibility = function() {
        console.error("Method not implemented");
    };


    /**
     * [__setLayerVisibility Define a visibilidade da layer]
     * @param  {[Boolean]} visibility [Visibilidade da layer true | false]
     */
    AbstractLayer.prototype.__setLayerVisibility = function(visibility) {
        console.error("Method not implemented");
    };


    /**
     * [__setLayerOpacity Define a visibilidade da layer]
     * @param  {[Boolean]} opacity [Opacidade da layer true | false]
     */
    AbstractLayer.prototype.__setLayerOpacity = function(opacity) {
        console.error("Method not implemented");
    };



    /**
     * [__setLayerFilter Filtra a camada]
     * @param  {[String]} query [Filtro a ser aplicado na layer]
     */
    AbstractLayer.prototype.__setLayerFilter = function(query) {
        console.error("Method not implemented");
    };


    /**
     * [__removeLayerFilter Remove Filtro da Camada]
     */
    AbstractLayer.prototype.__removeLayerFilter = function() {
        console.error("Method not implemented");
    };
    

    return AbstractLayer;

});