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
                start: function (idDatasouce, component) {
                    var url = presenterResources.analysis + "/" + idDatasouce + "/columns-sorl";
                    $http.get(url).then(function(response){
                        component.columns = response.data;
                    });
                }
            },
            WebService: {
                id: 'webservice',
                name: 'WebService',
                template: '_analysis-webservice.html'
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
            var url = presenterResources.analysis + "/" + idDatasouce + "/columns-endeca/"+domain;
            return $http.get(url);
        };
    });
});