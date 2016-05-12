define([
    'connecta.portal'
], function (portal) {
    portal.service('DomainService', function ($http, portalResources, $cookieStore) {

        this.getAll = function() {
            var url = portalResources.domain;
            return $http.get(url);
        };

        this.getDomainsByUser = function(username) {
            var url = portalResources.domain + '/' + username;
            return $http.get(url);
        };

        this.getDomainName = function(){
            return $cookieStore.get('user.domain.name');
        };

    });
});
