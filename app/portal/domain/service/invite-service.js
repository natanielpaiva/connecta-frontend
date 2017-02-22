/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/notify',
    'portal/auth/service/login-service'
], function (portal) {
    return portal.service('InviteService', function ($q, DomainService, LoginService) {
        var InviteService = this;

        /**
         * 
         * @param {type} idDomain
         * @param {type} emails
         * @param {type} accessToken
         * @returns {.$q@call;defer.promise}
         */
        InviteService.invite = function (idDomain, emails, accessToken) {
            var deferred = $q.defer();
            if (emails) {
                DomainService.inviteUser(emails, idDomain, accessToken).then(function () {
                    deferred.resolve();
                }, function () {
                    deferred.reject();
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        };
    });
});

