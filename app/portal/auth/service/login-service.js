define([
  'connecta.portal'
], function(portal) {
  return portal.service('LoginService', function(portalResources, $http, $rootScope, $cookieStore) {

    this.checkAuthentication = function(){
      this.setAuthenticated(
        $cookieStore.get('Authorization') ? true : false
      );
    };

    this.setAuthenticated = function(bool){
      console.log('authenticated: ', bool);
      $rootScope.$broadcast('login.authenticated', bool);
    };

    this.doLogin = function(credentials) {
      var req = {
        method: 'POST',
        url: portalResources.login,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: credentials,
        transformRequest: function(obj) {
          var str = [];
          for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        withCredentials: true
      };
      return $http(req);
    };

  });
});
