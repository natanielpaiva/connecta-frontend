define([
    'angular',
    'connecta.datamodel'
], function (angular, datamodel) {
    
    return datamodel.lazy.service('DatasourceService', function(datamodelResources, $http){
        var typeConfig = {
            DATABASE: {
                name: 'Database',
                template: 'app/datamodel/datasource/template/_datasource-database.html',
                icon:'icon-database2'
            },
            ENDECA: {
                name: 'Endeca',
                template: 'app/datamodel/datasource/template/_datasource-endeca.html',
                icon:'icon-endeca'
            },
            HDFS: {
                name: 'HDFS',
                template: 'app/datamodel/datasource/template/_datasource-hdfs.html',
                icon:'icon-hadoop'
            },
            BI: {
                name: 'OBIEE',
                template: 'app/datamodel/datasource/template/_datasource-obiee.html',
                icon:'icon-obiee'
            },
            SOLR: {
                name: 'SOLR',
                template: 'app/datamodel/datasource/template/_datasource-solr.html',
                icon:'icon-solr'
            },
            WEBSERVICE: {
                name: 'WebService',
                template: 'app/datamodel/datasource/template/_datasource-webservice.html',
                icon:'icon-webservice' // Capitão Planeta?
            }
        };
        
        var getTypeUrl = function(datasource) {
            return datamodelResources.datasource+'/'+datasource.type.toLowerCase();
        };
        
        this.getTypes = function() {
            return typeConfig;
        };
        
        this.save = function(datasource){
            var url = getTypeUrl(datasource);
            
            var datasourceCopy = angular.copy(datasource);
            
            return $http.post(url, datasourceCopy);
        };
        
        this.list = function(params){
            var url = datamodelResources.datasource;
            return $http.get(url, {
                params: params
            });
        };
        
        this.remove = function(id){
            var url = datamodelResources.datasource +'/'+id;
            return $http.delete(url);
        };
        
        this.getById = function(id){
            var url = datamodelResources.datasource +'/'+id;
            return $http.get(url);
        };
        
    });
    
});