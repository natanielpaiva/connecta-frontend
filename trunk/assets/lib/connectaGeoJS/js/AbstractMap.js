define([], function() {

    //Descritor das implementações dos métodos dos mapas
    var AbstractMap = function() {
        Function.apply(this);

        //proxy para api openlayers js
        //this.__openlayersProxyURL = "http://localhost/cgi-bin/proxy.cgi?url=";
        this.__openlayersProxyURL = ConnectaGeoConfig.proxyURLOpenlayers;

        //proxy para api esri js
        this.__esriProxyURL = "http://geobidesenv.cds.com.br/esriProxy/proxy.jsp";
    };

    AbstractMap.prototype = new Function();
    AbstractMap.prototype.construtor = AbstractMap;

    /**
     * [__createMap Criar o Mapa]
     * @param  {[JSON]} configMap [Config do Mapa a ser criado]
     */
    AbstractMap.prototype.__createMap = function(configMap) {
        console.error("Method not implemented");
    };

    /**
     * [__getMap Retorna o objeto  map]
     * @param  {[Map]} map [Objeto Map]
     */
    AbstractMap.prototype.__getMap = function() {
        console.error("Method not implemented");
    };


    /**
     * [__deactivateControls Desativa todos os controles do Mapa]
     */
    AbstractMap.prototype.__deactivateControls = function() {
        console.error("Method not implemented");
    };


    /**
     * [__zoomMapToMaxExtent Zoom na extensão total do mapa]
     */
    AbstractMap.prototype.__zoomMapToMaxExtent = function() {
        console.error("Method not implemented");
    };


    /**
     * [__setMapCenter Centraliza o mapa (longitude e latitude)]
     * @param  {[JSON]} configSetCenter [Objeto com coordenadas para centralizar o mapa]
     */
    AbstractMap.prototype.__setMapCenter = function(configSetCenter) {
        console.error("Method not implemented");
    };

    /**
     * [__setMapCenter Centraliza o mapa por extensão (bounds)]
     * @param  {[JSON]} configBounds [Objeto com dimensões para zoom]
     */
    AbstractMap.prototype.__zoomMapToExtent = function(configBounds) {
        console.error("Method not implemented");
    };

    /**
     * [__addGoogleBaseLayers Adiciona Base Layers do Google]
     */
    AbstractMap.prototype.__addGoogleBaseLayers = function() {
        console.error("Method not implemented");
    };


    /**
     * [__addBingBaseLayers Adiciona Base Layers do Bing]
     */
    AbstractMap.prototype.__addBingBaseLayers = function() {
        console.error("Method not implemented");
    };


    /**
     * [__addOsmBaseLayers Adiciona Base Layer do OpenStreetMap]
     */
    AbstractMap.prototype.__addOsmBaseLayers = function() {
        console.error("Method not implemented");
    };

    /**
     * [__addAllBaseLayers Adiciona todas as Base layers ao Mapa]
     */
    AbstractMap.prototype.__addAllBaseLayers = function() {
        console.error("Method not implemented");
    };


    /**
     * [__addCustomBaseLayer Adiciona baseLayer ao Mapa]
     * @param  {[JSON]} configBaseLayer [Config da baseLayer a ser adicionada]
     */
    AbstractMap.prototype.__addCustomBaseLayer = function(configBaseLayer) {
        console.error("Method not implemented");
    };


    /**
     * [__removeCustomBaseLayer Remove baseLayer do Mapa]
     * @param  {[String]} baseLayerName [Nome da camada Base a ser removida]
     */
    AbstractMap.prototype.__removeCustomBaseLayer = function(baseLayerName) {
        console.error("Method not implemented");
    };


    /**
     * [__createLayer Criar  layer]
     * @param  {[JSON]} config [Config da Layer a ser criada]
     */
    AbstractMap.prototype.__createLayer = function(config) {
        console.error("Method not implemented");
    };

    /**
     * [__addLayer Adiciona layer ao mapa]
     * @param  {[JSON]} Layer [Layer a ser adicionada]
     */
    AbstractMap.prototype.__addLayer = function(Layer) {
        console.error("Method not implemented");
    };

    /**
     * [__removeLayer Remove layer do mapa]
     * @param  {[JSON]} Layer [Layer a ser removida]
     */
    AbstractMap.prototype.__removeLayer = function(Layer) {
        console.error("Method not implemented");
    };

    /**
     * [__getLayerByName Retorna camada pelo nome]
     * @param  {[String]} LayerName [Nome da Layer a ser retornada]
     * @param  {[JSON]} layer [Layer]
     */
    AbstractMap.prototype.__getLayerByName = function(LayerName) {
        console.error("Method not implemented");
    };

    /**
     * [__createControl Criar  control]
     * @param  {[JSON]} config [Config do Control a ser criado]
     */
    AbstractMap.prototype.__createControl = function(config) {
        console.error("Method not implemented");
    };

    /**
     * [__addControl Adiciona controle ao mapa]
     * @param  {[JSON]} control [Controle a ser adicionado]
     */
    AbstractMap.prototype.__addControl = function(control) {
        console.error("Method not implemented");
    };

    /**
     * [__removeControl Remove controle do mapa]
     * @param  {[JSON]} control [Controle a ser removido]
     */
    AbstractMap.prototype.__removeControl = function(control) {
        console.error("Method not implemented");
    };

    /**
     * [__getControlByName Retorna controle pelo nome]
     * @param  {[String]} controlName [Nome do Controle a ser retornada]
     * @param  {[JSON]} control [Control]
     */
    AbstractMap.prototype.__getControlByName = function(controlName) {
        console.error("Method not implemented");
    };

    /**
     * [__createGeocoder Cria o componente de Geocodificação]
     */
    AbstractMap.prototype.__createGeocoder = function() {
        console.error("Method not implemented");
    };

    /**
     * [__removeGeocoder Remove o componente de Geocodificação]
     */
    AbstractMap.prototype.__removeGeocoder = function() {
        console.error("Method not implemented");
    };

    /**
     * [__getMap Retorna o objeto do map]
     * @param  {[String]} user [Nome do usuário]
     * @param  {[String]} password [Senha do usuário]
     */
    AbstractMap.prototype.__createAuthenticator = function(user, password) {
        console.error("Method not implemented");
    };

    /**
     * [__createComponent Criar  component]
     * @param  {[JSON]} config [Config do Component a ser criado]
     */
    AbstractMap.prototype.__createComponent = function(config) {
        console.error("Method not implemented");
    };

    /**
     * [__addComponent Adiciona component]
     * @param  {[Component]} component [Component a ser adicionado no mapa]
     */
    AbstractMap.prototype.__addComponent = function(component) {
        console.error("Method not implemented");
    };

    /**
     * [__removeComponent Remove component]
     * @param  {[Component]} component [Component a ser removido do mapa]
     */
    AbstractMap.prototype.__removeComponent = function(component) {
        console.error("Method not implemented");
    };

    /**
     * [__getComponentByName Retorna component pelo nome]
     * @param  {[String]} componentName [Nome do Componente a ser retornadn]
     */
    AbstractMap.prototype.__getComponentByName = function(componentName) {
        console.error("Method not implemented");
    };

    /**
     * [__previousView Visualização anterior do Mapa]
     */
    AbstractMap.prototype.__previousView = function() {
        console.error("Method not implemented");
    };

    /**
     * [__nextView Próxima visualização do Mapa]
     */
    AbstractMap.prototype.__nextView = function() {
        console.error("Method not implemented");
    };


    /**
     * [__switchBaseLayer Altera a camada base do Mapa]
     * @param  {[String]} baseLayerName [Nome da camada Base]
     */
    AbstractMap.prototype.__switchBaseLayer = function(baseLayerName) {
        console.error("Method not implemented");
    };

    /**
     * [__monitoringMap Verifica quando o mapa terminou de ser carregado]
     */
    AbstractMap.prototype.__monitoringMap = function() {
        console.error("Method not implemented");
    };


    /**
     * [__createMouseCoords Cria componente de exibição de coordenadas]
     */
    AbstractMap.prototype.__createMouseCoords = function() {
        console.error("Method not implemented");
    };


    /**
     * [__showCoordinates Exibe as coordenadas do ponto em que o mouse está]
     * @param  {[Event]} evt [Evento do Mapa]
     */
    AbstractMap.prototype.__showCoordinates = function(evt) {
        console.error("Method not implemented");
    };


    /**
     * [__removeMouseCoords Remove componente de exibição de coordenadas]
     */
    AbstractMap.prototype.__removeMouseCoords = function() {
        console.error("Method not implemented");
    };


    /**
     * [__activateZoomBox Ativa controle de Zoom em área]
     */
    AbstractMap.prototype.__activateZoomBox = function() {
        console.error("Method not implemented");

    };


    /**
     * [__deactivateZoomBox Desativa controle de Zoom em área]
     */
    AbstractMap.prototype.__deactivateZoomBox = function() {
        console.error("Method not implemented");


    };



    /**
     * [__zoomMapToLayerExtent Enquadra o mapa na extensão da Layer]
     * @param  {[Extent]} layerExtent [Extensão da Layer]
     */
    AbstractMap.prototype.__zoomMapToLayerExtent = function(layerExtent) {
        console.error("Method not implemented");


    };


    /**
     * [__zoomToPoint Enquadra o mapa no ponto informado]
     * @param  {[ESRI Point]} point [Ponto  esri js API]
     */
    AbstractMap.prototype.__zoomToPoint = function(point) {
        console.error("Method not implemented");
    };



    /**
     * [__zoomToLayerExtent Enquadra o mapa na extensão informada]
     * @param  {[JSON]} configExtent [Config da Extensão a ser enquadrada]
     */
    AbstractMap.__zoomToLayerExtent = function(configExtent) {
        console.error("Method not implemented");
    };



    return AbstractMap;

});