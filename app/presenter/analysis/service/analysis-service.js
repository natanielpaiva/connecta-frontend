define([
    'connecta.presenter'
], function (presenter) {

    return presenter.lazy.service('AnalysisService', function (presenterResources, $http) {
//        
//        var types = {
//            HDFS:{
//                start:function(){}
//            },
//            DATABASE: {
//                start:function(){}
//            }
//        };
//        
//        var _types = [
//            'DATABASE',
//            'HDFS'
//        ];
//        
//        var analysis = {
//            name:'',
//            type:_types[0]
//        };
//        
//        types[ analysis.type ].start();

        var types = [
            {
                id: 'database',
                name: 'Database',
                template: '_analysis-database.html'
            },
            {
                id: 'endeca',
                name: 'Endeca',
                template: '_analysis-endeca.html'
            },
            {
                id: 'hdfs',
                name: 'HDFS',
                template: '_analysis-hdfs.html'
            },
            {
                id: 'bi',
                name: 'OBIEE',
                template: '_analysis-obiee.html'
            },
            {
                id: 'solr',
                name: 'SOLR',
                template: '_analysis-solr.html',
                start: function (idDatasouce){
                    var url = presenterResources.analysis + "/"+idDatasouce+"/columns-sorl";
                    return $http.get(url);
                }
            },
            {
                id: 'webservice',
                name: 'WebService',
                template: '_analysis-webservice.html'
            },
            {
                id: 'csv',
                name: 'CSV',
                template: '_analysis-csv.html'
            }
        ];

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
    });
});