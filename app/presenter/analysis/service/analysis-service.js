/* global angular */
define([
    'connecta.presenter',
    'presenter/analysis/controller/_analysis-database',
    'presenter/analysis/controller/_analysis-endeca',
    'presenter/analysis/controller/_analysis-sorl',
    'presenter/analysis/controller/_analysis-webservice',
    'presenter/analysis/controller/_analysis-csv',
    'presenter/analysis/controller/_analysis-obiee',
    'presenter/analysis/controller/_analysis-hdfs',
    'presenter/analysis/controller/_analysis-rest',
    'presenter/analysis/controller/_analysis-wso2'
], function (presenter,
        DatabaseAnalysisFormController,
        EndecaAnalysisFormController,
        SolrAnalysisFormController,
        WebserviceAnalysisFormController,
        CsvAnalysisFormController,
        ObieeAnalysisFormController,
        HdfsAnalysisFormController,
        RestAnalysisFormController,
        Wso2AnalysisFormController) {

    return presenter.lazy.service('AnalysisService', function (presenterResources, $http, DomainService) {

        var _types = {
            DATABASE: {
                id: 'database',
                type: 'DATABASE',
                icon: 'icon-database2',
                template: '_analysis-database.html',
                controller: DatabaseAnalysisFormController
            },
            ENDECA: {
                id: 'endeca',
                type: 'ENDECA',
                icon: 'icon-endeca',
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
                type: 'HDFS',
                icon: 'icon-hadoop',
                template: '_analysis-hdfs.html',
                controller: HdfsAnalysisFormController
            },
            BI: {
                id: 'bi',
                type: 'OBIEE',
                icon: 'icon-obiee',
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
                type: 'SOLR',
                icon: 'icon-solr',
                template: '_analysis-solr.html',
                controller: SolrAnalysisFormController
            },
            WEBSERVICE: {
                id: 'webservice',
                name: 'WebService',
                icon: 'icon-webservice',
                template: '_analysis-webservice.html',
                controller: WebserviceAnalysisFormController,
                start: function (datasouce, component) {
                    component.typeWebservice = datasouce.typeWebservice;
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
                type: 'CSV',
                icon: 'icon-insert-drive-file',
                template: '_analysis-csv.html',
                controller: CsvAnalysisFormController
            },
            REST: {
                id: 'rest',
                type: 'REST',
                icon: 'icon-solr',
                template: '_analysis-rest.html',
                controller: RestAnalysisFormController,
                start: function (datasouce, component) {
                    var url = presenterResources.datasource + '/' + datasouce.id + "/rest";
                     $http.get(url).then(function(response){
                         component.restRequests = response.data.requests;
                     });
                }
            },
            WSO2: {
                id: 'wso2',
                name: 'WSO2',
                icon: 'icon-obiee',
                template: '_analysis-wso2.html',
                controller: Wso2AnalysisFormController,
                start: function (idDatasource, component) {
                    var url = presenterResources.analysis + "/" + idDatasource.id + "/tables-wso2";
                    $http.get(url).then(function (response) {
                        component.tableWso2 = response.data;
                    });
                }
            },
        };

        var _databaseRequestTypes = {
            SQL: 'ANALYSIS.DATABASE.REQUEST_SQL',
            TABLE: 'ANALYSIS.DATABASE.REQUEST_TABLE'
        };

        var _solrRequestTypes = {
            QUERY_BUILDER: 'ANALYSIS.SOLR.QUERY_BUILDER',
            TEXT_QUERY: 'ANALYSIS.SOLR.TEXT_QUERY'
        };



        var _filterOperators = {
            EQUAL: {
                order: 0,
                icon: 'icon-filter-equal',
                name: 'DASHBOARD.FILTER.TYPE.EQUAL',
                type: 'VALUE'
            },
            NOT_EQUAL: {
                order: 1,
                icon: 'icon-filter-not-equal',
                name: 'DASHBOARD.FILTER.TYPE.NOT_EQUAL',
                type: 'VALUE'
            },
            LESS_THAN: {
                order: 2,
                icon: 'icon-filter-less-than',
                name: 'DASHBOARD.FILTER.TYPE.LESS_THAN',
                type: 'NUMBER'
            },
            LESS_THAN_EQUAL: {
                order: 3,
                icon: 'icon-filter-less-than-equal',
                name: 'DASHBOARD.FILTER.TYPE.LESS_THAN_EQUAL',
                type: 'NUMBER'
            },
            GREATER_THAN: {
                order: 4,
                icon: 'icon-filter-greater-than',
                name: 'DASHBOARD.FILTER.TYPE.GREATER_THAN',
                type: 'NUMBER'
            },
            GREATER_THAN_EQUAL: {
                order: 5,
                icon: 'icon-filter-greater-than-equal',
                name: 'DASHBOARD.FILTER.TYPE.GREATER_THAN_EQUAL',
                type: 'NUMBER'
            },
            BETWEEN: {
                order: 6,
                icon: 'icon-filter-between',
                name: 'DASHBOARD.FILTER.TYPE.BETWEEN',
                type: 'INTERVAL'
            },
            IN: {
                order: 7,
                icon: 'icon-filter-in',
                name: 'DASHBOARD.FILTER.TYPE.IN',
                type: 'ARRAY'
            },
            CONTAINS: {
                order: 8,
                icon: 'icon-filter-contains',
                name: 'DASHBOARD.FILTER.TYPE.CONTAINS',
                type: 'STRING'
            },
            STARTS_WITH: {
                order: 9,
                icon: 'icon-filter-starts-with',
                name: 'DASHBOARD.FILTER.TYPE.STARTS_WITH',
                type: 'STRING'
            },
            ENDS_WITH: {
                order: 10,
                icon: 'icon-filter-ends-with',
                name: 'DASHBOARD.FILTER.TYPE.ENDS_WITH',
                type: 'STRING'
            }
        };

        this.getFilterOperators = function () {
            return _filterOperators;
        };

        // listar todas as analysis
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
            return _types;
        };

        this.getDatabaseRequestTypes = function () {
            return _databaseRequestTypes;
        };

        this.getSolrRequestTypes = function () {
            return _solrRequestTypes;
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

        var _prepareAnalysisRequest = function (analysisExecuteRequest) {
            var analysisExecuteRequestCopy = angular.copy(analysisExecuteRequest);

            if (!analysisExecuteRequestCopy.filters) {
                analysisExecuteRequestCopy.filters = [];
            }

            analysisExecuteRequestCopy.filters = analysisExecuteRequestCopy.filters.filter(function (filter) {
                return filter.type && filter.analysisColumn && filter.value;
            }).map(function (filter) {
                return {
                    operator: filter.type, // o tipo do filtro
                    columnName: filter.analysisColumn.name,
                    value: filter.value
                };
            });

            return analysisExecuteRequestCopy;
        };

        this.execute = function (analysisExecuteRequest) {
            var url = presenterResources.analysis + "/result";

            var analysisExecuteRequestCopy = _prepareAnalysisRequest(analysisExecuteRequest);

            return $http.post(url, analysisExecuteRequestCopy);
        };

        this.possibleValuesFor = function (analysisExecuteRequest, filter) {
            var url = presenterResources.analysis + "/filter-value?column=" +
                    filter.analysisColumn.name; // Não tem outro jeito de fazer post com parâmetros :/

            var analysisExecuteRequestCopy = _prepareAnalysisRequest(analysisExecuteRequest);

            analysisExecuteRequestCopy.filters = analysisExecuteRequestCopy.filters.filter(function (f) {
                return f.columnName !== filter.analysisColumn.name;
            });

            return $http.post(url, angular.copy(analysisExecuteRequestCopy));
        };

        this.getAnalysis = function (idAnalysis) {
            var url = presenterResources.analysis + "/" + idAnalysis;
            return $http.get(url);
        };

        this.getAnalysisRest = function (idAnalysis) {
            var url = presenterResources.analysis + "/" + idAnalysis +"/rest";
            return $http.get(url);
        };

        this.save = function (analysis) {
            _fixAttributes(analysis);
            var url = presenterResources.analysis;
            var analysisCopy = angular.copy(analysis);
            analysisCopy.domain = DomainService.getDomainName();
            return $http.post(url, analysisCopy);
        };

        var _fixAttributes = function (analysis) {
            angular.forEach(analysis.analysisAttributes, function (attribute) {
                if (angular.isString(attribute.attribute)) {
                    attribute.attribute = {name: attribute.attribute, description: "", type: attribute.attributeType.label};
                    delete attribute.attributeType;
                } else {
                    if (attribute.attributeType !== undefined) {
                        attribute.attribute.type = attribute.attributeType.label;
                        delete attribute.attributeType;
                    }
                }
            });
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
        this.getResulApplyingXpath = function (analysis, operation) {
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
        this.getSolrResultApplyingQuery = function (idDatasouce, query, facet) {
            var queryPersist = angular.copy({"statement": query});
            _fixQueryBuilder(queryPersist, false);
            var url = presenterResources.analysis + "/" + idDatasouce + "/solr-result-applying-query/facet/" + facet;
            return $http.post(url, queryPersist);
        };

        this.saveQueryBuilder = function (query) {
            var queryBuilder = angular.copy({"statement": query});
            var urlSaveQuery = presenterResources.group + "/query";

            _fixQueryBuilder(queryBuilder);
            return $http.post(urlSaveQuery, queryBuilder);
        };

        this.formatQueryBuiderEdit = function (query) {
            _fixQueryBuilder(query.statement, true);
            return query;
        };

        this.getConditionsSorl = function (id) {
            var url = presenterResources.analysis + "/" + id + "/conditions-sorl";
            return $http.get(url);
        };

        //csv
        this.getResultCSV = function (analysis) {
            var analysisCopy = angular.copy(analysis);
            var url = presenterResources.analysis + "/result-csv";
            return $http.post(url, analysisCopy);
        };
        
        this.sendRequest = function (analysis) {
            var analysisCopy = angular.copy(analysis);
           var url = presenterResources.analysis + '/execute-rest';
            return $http.post(url, analysisCopy);
        };

        this.getTabularFormatJson = function ( analysis) {
            var analysisCopy = angular.copy(analysis);
            console.log("analysis ", analysisCopy);
            var url = presenterResources.analysis + "/rest-tabular-format";
            return $http.post(url, analysisCopy);
        };


        //solr
        var _fixQueryBuilder = function (statement, edit) {
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

        var agreementValueArray = function (value, edit) {
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

        var agreementValueString = function (value, edit) {
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

        var agreementValueObject = function (value, edit) {
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

        this.bulkRemove = function (analysisList) {
            return $http.delete(presenterResources.analysis, {
                data: analysisList.map(function (e) {
                    return e.id;
                }),
                headers: {
                    // WTF, saporra ta mandando text/plain
                    'Content-Type': 'application/json'
                }
            });
        };

        this.createSocket = function(){
            return new SockJS(presenterResources.webSocket);
        };

        this.createPublicSocket = function(){
            return new SockJS(presenterResources.publicWebSocket);
        };
    });
});