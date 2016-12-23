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

        this.getCurrentDomain = function () {
            return $http.get(portalResources.domain + '/' + $cookieStore.get('user.domain.name'));
        };

        this.getDomainName = function () {
            return $cookieStore.get('user.domain.name');
        };

        this.createDomain = function (domain) {
            var url = portalResources.domain;

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

        this.inviteUser = function (emailInvite, idDomain) {
            var url = portalResources.domain + '/invite?listEmails=' +
                    emailInvite + '&idDomain=' + idDomain;

            return $http.post(url);
        };

        this.getParticipants = function (idDomain) {
            var url = portalResources.domain + '/participants?id=' + idDomain;

            return $http.get(url);
        };

        this.removeUser = function (idDomain, idUser) {
            var url = portalResources.domain + '/domain/' + idDomain;

            return $http.put(url, idUser);
        };
    });
});
