/* global domain */
define([
    'connecta.portal',
    'portal/auth/service/login-service'
], function (portal) {
    portal.service('DomainService', function ($http, portalResources, $cookieStore, $location, LoginService) {

        this.getAll = function () {
            var url = portalResources.domain;

            return $http.get(url);
        };

        this.getDomainsByUser = function (email, accessToken) {
            return $http.get(portalResources.domain, {
                params: {
                    email: email
                },
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        };

        this.getCurrentDomain = function () {
            return $http.get(portalResources.domain + '/' + $cookieStore.get('user.domain.name'));
        };

        this.getDomainName = function () {
            return $cookieStore.get('user.domain.name');
        };

        this.createDomain = function (domain, accessToken) {
            var url = portalResources.domain;

            return $http.post(url, domain, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        };

        this.updateDomain = function (domain, accessToken) {
            accessToken = accessToken || LoginService.getAuthenticationToken();

            var url = portalResources.domain + '/' + domain.id;

            return $http.put(url, domain, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        };

        this.deleteDomain = function (id, accessToken) {
            var url = portalResources.domain + '/' + id;

            return $http.delete(url, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
        };

        this.inviteUser = function (emailInvite, idDomain, accessToken) {
            accessToken = accessToken || LoginService.getAuthenticationToken();
            var absUrl = $location.absUrl().split('#')[0];
            var url = portalResources.domain + '/invite?idDomain=' + idDomain +
                    '&url=' + absUrl;

            return $http.post(url, emailInvite, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
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
