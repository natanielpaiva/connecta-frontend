define([
    'angular',
    'connecta.presenter'
], function (angular, presenter) {

    return presenter.lazy.service('DatasourceService', function (presenterResources, $http, DomainService) {
        var typeConfig = {
            DATABASE: {
                name: 'Database',
                template: 'app/presenter/datasource/template/_datasource-database.html',
                icon: 'icon-database2'
            },
            HDFS: {
                name: 'HDFS',
                template: 'app/presenter/datasource/template/_datasource-hdfs.html',
                icon: 'icon-hadoop',
                disabled: true
            },
            OBIEE: {
                name: 'OBIEE',
                template: 'app/presenter/datasource/template/_datasource-obiee.html',
                icon: 'icon-obiee'
                        //disabled: true
            },
            SOLR: {
                name: 'SOLR',
                template: 'app/presenter/datasource/template/_datasource-solr.html',
                icon: 'icon-solr'
            },
            WEBSERVICE: {
                name: 'WebService',
                template: 'app/presenter/datasource/template/_datasource-webservice.html',
                icon: 'icon-webservice' // Capitão Planeta?
                        //disabled: true
            },
            REST: {
                name: 'REST',
                template: 'app/presenter/datasource/template/_datasource-rest.html',
                icon: 'icon-webservice' // Capitão Planeta?
                        //disabled: true
            }
        };

        var databaseDrivers = {
            ORACLE_SID: {
                name: 'Oracle Thin (Service ID - SID)',
                defaultPort: 1521,
                hasSid: true
            },
            ORACLE_SNM: {
                name: 'Oracle Thin (Service Name)',
                defaultPort: 1521,
                hasSid: true
            },
            POSTGRESQL: {
                name: 'PostgreSQL',
                defaultPort: 5432,
                hasSid: true
            },
            MYSQL: {
                name: 'MySQL',
                defaultPort: 3306,
                hasSid: false
            },
            SQLSERVER: {
                name: 'Sql Server',
                defaultPort: 1433,
                hasSid: false
            },
            ORIENTDB: {
                name: 'Oriente db',
                defaultPort: 2424,
                hasSid: false
            },
        };

        var getTypeUrl = function (datasource) {
            return presenterResources.datasource + '/' + datasource.type.toLowerCase();
        };

        this.getTypes = function () {
            return typeConfig;
        };

        this.getDatabaseDrivers = function () {
            return databaseDrivers;
        };

        this.save = function (datasource) {
            var url = getTypeUrl(datasource);

            var datasourceCopy = angular.copy(datasource);
            datasourceCopy.domain = DomainService.getDomainName();

            return $http.post(url, datasourceCopy);
        };

        this.testConnection = function (datasource) {
            var url = presenterResources.datasource + "/test-connection";
            var datasourceCopy = angular.copy(datasource);
            datasourceCopy.domain = DomainService.getDomainName();
            return $http.post(url, datasourceCopy);
        };

        this.list = function (params) {
            var url = presenterResources.datasource;
            return $http.get(url, {
                params: params
            });
        };

        this.remove = function (id) {
            var url = presenterResources.datasource + '/' + id;
            return $http.delete(url);
        };

        this.getById = function (id) {
            var url = presenterResources.datasource + '/' + id;
            return $http.get(url);
        };



        this.bulkRemove = function (datasources) {
            return $http.delete(presenterResources.datasource, {
                data: datasources.map(function (e) {
                    return e.id;
                }),
                headers: {
                    // WTF, saporra ta mandando text/plain
                    'Content-Type': 'application/json'
                }
            });
        };

        this.getRestRequestById = function (id) {
            var url = presenterResources.datasource + '/' + id + "/rest";
            return $http.get(url);
        };

        this.sendRequest = function (request) {
           var url = presenterResources.datasource + '/send-request';
            return $http.post(url, request);
        };

    });

});
