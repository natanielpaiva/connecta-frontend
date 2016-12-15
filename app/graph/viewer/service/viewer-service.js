define([
    'angular',
    'connecta.graph'
], function (angular, graph) {

    return graph.lazy.service('ViewerService', function (graphResources, $http, DomainService) {
        var typeConfig = {
            DATABASE: {
                name: 'Database',
                template: 'app/graph/viewer/template/_viewer-database.html',
                icon: 'icon-database2'
            },
            HDFS: {
                name: 'HDFS',
                template: 'app/graph/viewer/template/_viewer-hdfs.html',
                icon: 'icon-hadoop',
                disabled: true
            },
            OBIEE: {
                name: 'OBIEE',
                template: 'app/graph/viewer/template/_viewer-obiee.html',
                icon: 'icon-obiee'
                        //disabled: true
            },
            SOLR: {
                name: 'SOLR',
                template: 'app/graph/viewer/template/_viewer-solr.html',
                icon: 'icon-solr'
            },
            WEBSERVICE: {
                name: 'WebService',
                template: 'app/graph/viewer/template/_viewer-webservice.html',
                icon: 'icon-webservice' // Capitão Planeta?
                        //disabled: true
            },
            REST: {
                name: 'REST',
                template: 'app/graph/viewer/template/_viewer-rest.html',
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
            }
        };

        var getTypeUrl = function (viewer) {
            return graphResources.viewer + '/' + viewer.type.toLowerCase();
        };

        this.getTypes = function () {
            return typeConfig;
        };

        this.getDatabaseDrivers = function () {
            return databaseDrivers;
        };

        this.save = function (viewer) {
            var url = getTypeUrl(viewer);

            var viewerCopy = angular.copy(viewer);
            viewerCopy.domain = DomainService.getDomainName();

            return $http.post(url, viewerCopy);
        };

        this.testConnection = function (viewer) {
            var url = graphResources.viewer + "/test-connection";
            var viewerCopy = angular.copy(viewer);
            viewerCopy.domain = DomainService.getDomainName();
            return $http.post(url, viewerCopy);
        };

        this.list = function (params) {
            var url = graphResources.viewer;
            return $http.get(url, {
                params: params
            });
        };

        this.remove = function (id) {
            var url = graphResources.viewer + '/' + id;
            return $http.delete(url);
        };

        this.getById = function (id) {
            var url = graphResources.viewer + '/' + id;
            return $http.get(url);
        };



        this.bulkRemove = function (viewers) {
            return $http.delete(graphResources.viewer, {
                data: viewers.map(function (e) {
                    return e.id;
                }),
                headers: {
                    // WTF, saporra ta mandando text/plain
                    'Content-Type': 'application/json'
                }
            });
        };

        this.getRestRequestById = function (id) {
            var url = graphResources.viewer + '/' + id + "/rest";
            return $http.get(url);
        };

        this.sendRequest = function (request) {
           var url = graphResources.viewer + '/send-request';
            return $http.post(url, request);
        };

    });

});
