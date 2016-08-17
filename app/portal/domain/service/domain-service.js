/* global domain */
define([
    'connecta.portal'
], function (portal) {
    portal.service('DomainService', function ($http, portalResources, $cookieStore) {

        this.getAll = function () {
            var url = portalResources.domain;
            return $http.get(url);
        };

        this.getDomainsByUser = function (email) {
            return $http.get(portalResources.domain, {
                params: {
                    email: email
                }
            });
        };

        this.getDomainName = function () {
            return $cookieStore.get('user.domain.name');
        };

        this.createDomain = function (domain) {
            var url = portalResources.domain + '/create';

            return $http.post(url, domain);
        };
        this.updateDomain = function (domain) {

            var url = portalResources.domain + '/' + domain.id;

            return $http.put(url, domain);
        };
        this.deleteDomain = function (id) {

            var url = portalResources.domain + '/' + id;

            return $http.delete(url);

        };

    });
});
