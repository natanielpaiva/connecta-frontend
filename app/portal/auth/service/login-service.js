define([
  'connecta.portal'
], function(portal) {
  return portal.service('LoginService', function(portalResources, $http, $rootScope, $cookieStore) {
    var loginService = this;

    /**
     * Atualiza o escopo da autenticação de acordo
     * com o retorno do método isAuthenticated()
     */
    this.checkAuthentication = function(){
      this.setAuthenticated(
        this.isAuthenticated()
      );
    };

    /**
     * Recupera o token da autenticação
     * @returns {String}
     */
    this.getAuthenticationToken = function(){
      return $cookieStore.get('Authorization');
    };

    /**
     * Alerta o escopo do app se ele está autenticado ou não
     * @param {Boolean} authenticated
     */
    this.setAuthenticated = function(authenticated){
      $rootScope.$broadcast('login.authenticated', authenticated);
    };

    /**
     * Remove o cookie guardado da autenticação
     * e alerta o escopo do app que falta autenticar
     */
    this.unauthenticate = function(){
      $cookieStore.remove('Authorization');
      loginService.setAuthenticated(false);
    };

    /**
     * Retorna se o app está autenticado ou não
     * @returns {Boolean}
     */
    this.isAuthenticated = function(){
      return $cookieStore.get('Authorization') ? true : false;
    };

    /**
     * Tenta autenticar o usuário passado
     * @param {Object} credentials
     * @returns {Promise}
     */
    this.doLogin = function(credentials) {
      var req = {
        method:'POST',
        url: portalResources.login,
        headers: {
          'Content-Type': 'application/json'
        },
        data: credentials
      };

      var promise = $http(req).then(function(response){
        $cookieStore.put('Authorization', response.data.token);
        loginService.setAuthenticated(true);
      }, function(){
        loginService.setAuthenticated(false);
      });

      return promise;
    };

    $rootScope.$on('login.request_unathorized', function(){
      loginService.unauthenticate();
    });

  });
});
