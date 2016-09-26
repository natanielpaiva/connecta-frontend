define([
    'connecta.maps',
    '../../helper/url'
], function (maps, urlHelper) {

    return maps.lazy.service('AnalysisService', function ($http, mapsResources) {

        var url = mapsResources.analysis;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (analysis) {
            return $http.post(url, analysis);
        };

        this.update = function (id, analysis) {
            return $http.put(url + '/' + id, analysis);
        };

        this.list = function (params) {
            var queryString = params ? urlHelper.queryStringify(params) : '';
            return $http.get(url + queryString);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

        this.getMetaData = function (url, params) {
            var mock = {"id":7044,"name":"Fecomercio","datasource":{"id":7042,"name":"Banco CDS 3.14","type":"DATABASE","password":"cds312","user":"portal","domain":"10","driver":"ORACLE_SID","server":"192.168.3.14","port":1521,"sid":"cdsdev","schema":"PORTAL"},"analysisColumns":[{"id":7057,"formula":"DESCRICAO_SUBCLASSE_CNAE","label":"Descrição da Subclasse CNAE","name":"DESCRICAO_SUBCLASSE_CNAE"},{"id":7056,"formula":"CODIGO_SUBCLASSE_CNAE","label":"Código da Subclasse CNAE","name":"CODIGO_SUBCLASSE_CNAE"},{"id":7055,"formula":"DESCRICAO_GRUPO","label":"Descrição do Grupo","name":"DESCRICAO_GRUPO"},{"id":7054,"formula":"CODIGO_GRUPO","label":"Código do grupo","name":"CODIGO_GRUPO","orderDrill":3},{"id":7053,"formula":"DESCRICAO_SECAO","label":"Descrição da Seção","name":"DESCRICAO_SECAO"},{"id":7052,"formula":"CODIGO_SECAO","label":"Código da Seção","name":"CODIGO_SECAO"},{"id":7045,"formula":"CNPJ","label":"CNPJ","name":"CNPJ"},{"id":7051,"formula":"DESCRICAO_NATUREZA_JURIDICA","label":"Descrição da Natureza Jurídica","name":"DESCRICAO_NATUREZA_JURIDICA","orderDrill":1},{"id":7050,"formula":"CODIGO_NATUREZA_JURIDICA","label":"Código da Natureza Jurídica","name":"CODIGO_NATUREZA_JURIDICA"},{"id":7049,"formula":"BAIRRO","label":"Bairro","name":"BAIRRO","orderDrill":2},{"id":7048,"formula":"TIPO_BAIRRO","label":"Tipo do Bairro","name":"TIPO_BAIRRO"},{"id":7047,"formula":"ANO_ABERTURA","label":"Ano de Abertura","name":"ANO_ABERTURA","orderDrill":0},{"id":7046,"formula":"QUANTIDADE_DE_ABERTURAS","label":"Quantidade de Aberturas","name":"QUANTIDADE_DE_ABERTURAS"}],"analysisAttributes":[],"analysisRelations":[],"hasDrill":true,"type":"DATABASE","domain":"10","sql":"select * from FECOMERCIO","requestType":"SQL","cached":true};
            return new Promise(function (resolve, reject) {
                resolve(mock);
            });
        };

    });

});
