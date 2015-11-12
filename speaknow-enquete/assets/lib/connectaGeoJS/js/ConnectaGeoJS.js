define(['bower_components/connectaGeoJS/index/config'], function() {

    var ConnectaGeoJS = function() {
        Function.apply(this);

        //Construtor
        //array para armazenar os objs dos mapas
        this.__objMaps = [];

        //Define as configurações default dos mapas
        this.__mapsConfig=[];

        //Adiciona configurações para API Openlayers
        this.__mapsConfig["Openlayers"]=configOpenlayers;

        //Adiciona configurações para API ESRI
        this.__mapsConfig["ESRI"]=configESRI;        

        //Deleta as variáveis globais de configuração
//        delete configOpenlayers;
//        delete configESRI;


    };

    ConnectaGeoJS.prototype = new Function();
    ConnectaGeoJS.prototype.construtor = ConnectaGeoJS;

    /**
     * [__createObjMap Criar obj Mapa de Acordo com a implementação desejada --Openlayers ou ESRI]
     * @param  {[JSON]} config [Config do objeto a ser criado]
     * @param  {[String]} callback [Nome da função a ser chamada quando o mapa estiver carregado]
     * @param  {[Object]} callbackParams [Parâmetros da função de callback]
     */
    ConnectaGeoJS.prototype.__createObjMap = function(config, callback, callbackParams) {

        var that = this;

        require([ConnectaGeoConfig.baseURL+ config.type + 'Implementation/Map'], function(MAP) {

            var map = new MAP(config, callback, callbackParams);
            map["objMapName"] = config.name;
            that.__objMaps.push(map);

        });

    };


    /**
     * [__destroyObjMap Destrói o obj do Mapa]
     * @param  {[obj]} objMap [objMap a ser destruído]
     */
    ConnectaGeoJS.prototype.__destroyObjMap = function(objMap) {

        //objMap.__map.destroy();
        var index = this.__objMaps.indexOf(objMap);
        this.__objMaps.splice(index, 1);
    };


    /**
     * [__getObjMapByName Retorna objMap pelo nome]
     * @param  {[String]} objMapName [nome do objeto a ser retornado]
     * @param  {[obj]} objMap [objMap]
     */
    ConnectaGeoJS.prototype.__getObjMapByName = function(objMapName) {

        for (var objMap in this.__objMaps) {

            if (this.__objMaps[objMap].objMapName == objMapName)
                return this.__objMaps[objMap];
        }

    };


    return ConnectaGeoJS;

});