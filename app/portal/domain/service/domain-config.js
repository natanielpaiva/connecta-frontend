/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/notify'
//    'portal/layout/service/util',
], function (portal) {
    return portal.service('DomainConfig', function ($q, DomainService, notify) {
        var DomainConfig = this;

        DomainConfig.inviteUser = function (id, emailsInvited) {
            if (emailsInvited) {
                var emails = emailsInvited.split(" ");
                DomainService.inviteUser(emails, id).then(function () {
                    notify.success('USER.INVITED_SUCCESS');
                });
            }

        };

    });
});



