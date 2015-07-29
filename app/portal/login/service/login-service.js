define([
    'connecta.portal'
], function (portal) {
    return portal.lazy.service('LoginService', function (portalResources, $http) {
        
        this.doLogin = function(credentials){
            var req = {
                method: 'POST',
                url: portalResources.login,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: credentials,
                transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
                },
                withCredentials: true
            };
            return $http(req);
        };   

    });
});