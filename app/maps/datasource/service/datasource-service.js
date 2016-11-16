define([
    "connecta.maps",
    "maps/helper/url",
    "json!applications.json"
], function (maps, urlHelper, applications) {

    return maps.lazy.service("DatasourceService", function ($http, mapsResources, presenterResources) {

        var url = mapsResources.dataSource;

        this.get = function (id) {
            return $http.get(url + '/' + id);
        };

        this.save = function (datasource) {
            return $http.post(url, datasource);
        };

        this.update = function (id, datasource) {
            return $http.put(url + '/' + id, datasource);
        };

        this.list = function (queryString) {
            return $http.get(url + queryString);
        };

        this.delete = function (id) {
            return $http.delete(url + '/' + id);
        };

        this.metadataObiee = function (dsn, user, password, path) {
            var url = applications.presenter.host + '/obiee/metadata?';
            url += 'location=' + dsn;
            url += '&user=' + user;
            url += '&password=' + password;
            url += '&path=' + (path ? path : '/shared');

            return $http.get(url);
        };

        this.catalogObiee = function (dsn, user, password, path) {
            var url = applications.portal.host + '/obiee/catalog?';
            url += 'location=' + dsn;
            url += '&user=' + user;
            url += '&password=' + password;
            url += '&path=' + (path ? path : '/shared');

            return $http.get(url);
        };

        this.listAnalysisConnecta = function() {
            return $http.get(presenterResources.analysis);
        };

        this.getAnalysisConnecta = function(id) {
            return $http.get(presenterResources.analysis + '/' + id);
        };

        this.listConnectaDatasources = function () {
            var params = '?size=*&filter={"serviceType":"connecta"}';

            return $http.get(url + params);
        };

        this.listColumnsByDatasourceId = function (datasourceId) {
            return $http.get(presenterResources.analysis + "/" + datasourceId);
        };

    });

});
