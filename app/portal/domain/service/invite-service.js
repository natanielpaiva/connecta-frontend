/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/notify'
], function (portal) {
    return portal.service('InviteService', function ($q, DomainService) {
        var InviteService = this;

        /**
         * 
         * @param {int} idDomain
         * @param {Array} emails
         * @returns {.$q@call;defer.promise}
         */
        InviteService.invite = function (idDomain, emails) {
            var deferred = $q.defer();
            if (emails) {
                DomainService.inviteUser(emails, idDomain).then(function () {
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

