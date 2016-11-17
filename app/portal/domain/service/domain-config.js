/* global angular */
define([
    'connecta.portal',
    'portal/layout/service/notify'
//    'portal/layout/service/util',
], function (portal) {
    return portal.service('DomainConfig', function ($q, DomainService, notify) {
        var DomainConfig = this;

        DomainConfig.inviteUser = function (hash, emailsInvited) {
            if (emailsInvited) {
                var emails = emailsInvited.split(" ");
                DomainService.inviteUser(emails, hash).then(function () {
                    notify.success('USER.INVITED_SUCCESS');
                },function(){
//                    notify('Já');
                });
            }

        };

    });
});



