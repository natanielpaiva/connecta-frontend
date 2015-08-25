define([
    'connecta.presenter'
], function (presenter) {

    return presenter.lazy.service('AnalysisService', function (presenterResources, $http) {
        var types = {
            DATABASE: {
                id: 'database',
                name: 'Database',
                template: '_analysis-database.html'
            },
            ENDECA: {
                id: 'endeca',
                name: 'Endeca',
                template: '_analysis-endeca.html',
                start: function (idDatasouce, component) {
                    var url = presenterResources.analysis + "/" + idDatasouce + "/domains-endeca";
                    $http.get(url).then(function (response) {
                        component.domain = response.data;
                    });
                }
            },
            HDFS: {
                id: 'hdfs',
                name: 'HDFS',
                template: '_analysis-hdfs.html'
            },
            BI: {
                id: 'bi',
                name: 'BI',
                template: '_analysis-obiee.html',
                field: "catalog",
                start: function (idDatasouce, component) {
                    var url = presenterResources.analysis + "/" + idDatasouce + "/catalog-obiee";
                    $http.post(url, {'path': null}).then(function (response) {
                        component.catalog = response.data;
                    });
                }
            },
            SOLR: {
                id: 'solr',
                name: 'SOLR',
                template: '_analysis-solr.html',
                start: function (datasouce, component) {
                    var url = presenterResources.analysis + "/" + datasouce.id + "/columns-sorl";
                    $http.get(url).then(function (response) {
                        component.columns = response.data;
                    });
                }
            },
            WEBSERVICE: {
                id: 'webservice',
                name: 'WebService',
                template: '_analysis-webservice.html',
                start: function (datasouce, component) {

                    component.typeWebservice = datasouce.typeWebservice;
                    console.log("datasouce.typeWebservice: ", datasouce.typeWebservice);
                    var url = null;
                    if (datasouce.typeWebservice === "REST") {
                        url = presenterResources.analysis + "/" + datasouce.id + "/get-rest-specifications";
                        $http.get(url).then(function (response) {
                            component.webserviceRestJson = response.data;
                        });
                    }

                    if (datasouce.typeWebservice === "SOAP") {
                        //Busca a lista de method do SOAP que podem ser executados
                        url = presenterResources.analysis + "/" + datasouce.id + "/method-soap";
                        $http.get(url).then(function (response) {
                            component.operationWebservice = response.data;
                        });
                    }
                }
            },
            CSV: {
                id: 'csv',
                name: 'CSV',
                template: '_analysis-csv.html'
            }
        };

        this.getTypes = function () {
            return types;
        };

        //lista data source   
        this.getListDatasource = function () {
            var url = presenterResources.datasource;
            return $http.get(url);
        };

        //lista de tabelas de um datasource
        this.getListTableDatasource = function (idDataSource) {
            var url = presenterResources.analysis + "/" + idDataSource + "/columns-datasource";
            return $http.get(url);
        };

        this.save = function (analysis) {
            var url = presenterResources.analysis;
            var analysisCopy = angular.copy(analysis);
            analysisCopy.type = analysisCopy.type.id.toUpperCase();
            return $http.post(url, analysisCopy);
        };

        //lista catalog Obiee
        this.getListCatologBiee = function (idDatasouce, path) {
            var url = presenterResources.analysis + "/" + idDatasouce + "/catalog-obiee";
            return $http.post(url, {'path': path});
        };

        //lista colunas Obiee
        this.getListColumnsObiee = function (idDatasouce, path) {
            var url = presenterResources.analysis + "/" + idDatasouce + "/columns-obiee";
            return $http.post(url, {'path': path});
        };

        //lista Columns endeca
        this.getListColumnsEndeca = function (idDatasouce, domain) {
            var url = presenterResources.analysis + "/" + idDatasouce + "/columns-endeca/" + domain;
            return $http.get(url);
        };

        this.getSoap = function (idDatasouce, operation, parametersWebservice) {
            //console.log("operation ", operation);
            var parameter = angular.copy(parametersWebservice);
            var url = presenterResources.analysis + "/" + idDatasouce + "/soap/operation/" + operation;
            return $http.post(url, parameter);
        };

        this.getResulApplyingXpath = function (idDatasouce, analysis, operation) {

            var analysisCopy = angular.copy(analysis);
            console.log("analysis ", analysisCopy);
            analysisCopy.type = analysisCopy.type.id.toUpperCase();
            var url = presenterResources.analysis + "/" + idDatasouce + "/soap-applying-xpath/operation/" + operation;
            return $http.post(url, analysisCopy);
        };
        
        this.getResulApplyingJson = function (idDatasouce, analysis) {

            var analysisCopy = angular.copy(analysis);
            console.log("analysis ", analysisCopy);
            analysisCopy.type = analysisCopy.type.id.toUpperCase();
            var url = presenterResources.analysis + "/" + idDatasouce + "/rest-get-applying-jsonPath";
            return $http.post(url, analysisCopy);
        };


    });
});