define([
    'connecta.presenter',
    'presenter/analysis/controller/_analysis-database',
    'presenter/analysis/controller/_analysis-endeca',
    'presenter/analysis/controller/_analysis-sorl',
    'presenter/analysis/controller/_analysis-webservice',
    'presenter/analysis/controller/_analysis-csv',
    'presenter/analysis/controller/_analysis-obiee',
    'presenter/analysis/controller/_analysis-hdfs',
], function (presenter, 
            DatabaseAnalysisFormController,
            EndecaAnalysisFormController,
            SolrAnalysisFormController,
            WebserviceAnalysisFormController,
            CsvAnalysisFormController,
            ObieeAnalysisFormController,
            HdfsAnalysisFormController) {
    
    return presenter.lazy.service('AnalysisService', function (presenterResources, $http) {
        var types = {
            DATABASE: {
                id: 'database',
                name: 'Database',
                template: '_analysis-database.html',
                controller: DatabaseAnalysisFormController
            },
            ENDECA: {
                id: 'endeca',
                name: 'Endeca',
                template: '_analysis-endeca.html',
                controller: EndecaAnalysisFormController,
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
                template: '_analysis-hdfs.html',
                controller: HdfsAnalysisFormController
            },
            BI: {
                id: 'bi',
                name: 'BI',
                template: '_analysis-obiee.html',
                field: "catalog",
                controller: ObieeAnalysisFormController,
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
                controller: SolrAnalysisFormController
                
//                start: function (datasouce, component) {
//                    var url = presenterResources.analysis + "/" + datasouce.id + "/columns-sorl";
//                    $http.get(url).then(function (response) {
//                        component.columns = response.data;
//                    });
//                }
            },
            WEBSERVICE: {
                id: 'webservice',
                name: 'WebService',
                template: '_analysis-webservice.html',
                controller: WebserviceAnalysisFormController,
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
                template: '_analysis-csv.html', 
                controller: CsvAnalysisFormController
            }
        };

        //listar todas as analysis
        this.list = function (params) {
            var url = presenterResources.analysis;
            return $http.get(url, {
                params: params
            });
        };

        //remove uma analysis
        this.remove = function (id) {
            var url = presenterResources.analysis + '/' + id;
            return $http.delete(url);
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


        this.getAnalysis = function (idAnalysis) {
            var url = presenterResources.analysis + "/" + idAnalysis ;
            return $http.get(url);
        };


        this.save = function (analysis) {
            var url = presenterResources.analysis;
            var analysisCopy = angular.copy(analysis);
            console.log("analysisCopy ", analysisCopy);
            //analysisCopy.type = analysisCopy.type.id.toUpperCase();
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
        
        //Soap
        this.getResulApplyingXpath = function ( analysis, operation) {
            var analysisCopy = angular.copy(analysis);
            var url = presenterResources.analysis + "/" + analysis.datasource.id + "/soap-applying-xpath/operation/" + operation;
            return $http.post(url, analysisCopy);
        };

        this.getResulApplyingJson = function (idDatasouce, analysis) {

            var analysisCopy = angular.copy(analysis);
            console.log("analysis ", analysisCopy);
            //analysisCopy.type = analysisCopy.type.id.toUpperCase();
            var url = presenterResources.analysis + "/" + idDatasouce + "/rest-get-applying-jsonPath";
            return $http.post(url, analysisCopy);
        };


           //solr
        this.getSolrResultApplyingQuery = function(idDatasouce, query, facet) {
               var queryPersist = angular.copy({"statement": query});
               _fixQueryBuilder(queryPersist, false);
               var url = presenterResources.analysis + "/" + idDatasouce + "/solr-result-applying-query/facet/" + facet;
               return $http.post(url, queryPersist);
          };
          
          this.saveQueryBuilder = function(query) {
               var queryBuilder = angular.copy({"statement": query});
               var urlSaveQuery = presenterResources.group + "/query";

               _fixQueryBuilder(queryBuilder);
               return $http.post(urlSaveQuery, queryBuilder);
          };
          
           this.formatQueryBuiderEdit = function(query) {
               _fixQueryBuilder(query.statement, true);
               return query;
          };


        this.getColumnsSorl = function(id){
            
            var url = presenterResources.analysis + "/" + id + "/columns-sorl";
            return $http.get(url);
        };


        //solr
        var _fixQueryBuilder = function (statement, edit) {

            //console.log("statement ", statement.type);
            if (statement.type === 'CONDITION_SOLR') {
                if (statement.predicate === 'EQUAL' ||
                        statement.predicate === 'NOT_EQUAL' ||
                        statement.predicate === 'LIKE' ||
                        statement.predicate === 'NOT_LIKE') {

                    statement.value = agreementValueString(statement.value, edit);
                }

                if (statement.predicate === 'BETWEEN' ||
                        statement.predicate === 'NOT_BETWEEN') {
                    statement.value = agreementValueObject(statement.value, edit);
                }

                if (statement.predicate === 'IN' ||
                        statement.predicate === 'NOT_IN') {
                    statement.value = agreementValueArray(statement.value, edit);
                }

            } else {
                
                var key;
                if (statement.statement !== undefined) {
                    for (key in statement.statement.statements) {
                        _fixQueryBuilder(statement.statement.statements[key]);
                    }
                } else {
                    for (key in statement.statements) {
                        _fixQueryBuilder(statement.statements[key], edit);
                    }
                }
            }

        };
        
        var agreementValueArray = function(value, edit) {
               var valueArray = [];
               for (var i in value) {
                    valueArray.push(value[i].text);
               }
               return {
                    "value": "",
                    "between": {},
                    "in": valueArray
               };
          };
        
        var agreementValueString = function(value, edit) {
               var retorno = {
                    "value": value,
                    "between": {},
                    "in": []
               };
               if (edit) {
                    retorno = value.value;
               }
               return retorno;
          };
          
          var agreementValueObject = function(value, edit) {

               var retorno = {
                    "value": "",
                    "between": value,
                    "in": []
               };
               if (edit) {
                    retorno = {"start": value.between.start, "end": value.between.end};
               }
               return retorno;

          };

    });
});