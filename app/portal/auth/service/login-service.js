define([
  'connecta.portal'
], function(portal) {
  return portal.service('LoginService', function(portalResources, $http, $rootScope, $cookieStore, $route, $q, $timeout) {

    var loginService = this;
    var _reloadNeeded = false;
    var _currentUser = null;

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
      return $cookieStore.get('X-Authorization-Token');
    };

    /**
     *
     * @returns {Object}
     */
    this.getCurrentUser = function(){
      var deferred = $q.defer();
      if ( !_currentUser ) {
        $http.get(portalResources.login+'/'+$cookieStore.get('X-Authorization-Token')).then(function(response){
          _currentUser = response.data;
          deferred.resolve(_currentUser);
        });
      } else {
        $timeout(function(){
          deferred.resolve(_currentUser);
        });
      }

      return deferred.promise;
    };

    /**
     * Atualiza os dados do usuário
     */
    this.refreshCurrentUser = function(){
      var deferred = $q.defer();

      $http.get(portalResources.login+'/'+$cookieStore.get('X-Authorization-Token')).then(function(response){
        _currentUser = response.data;
        deferred.resolve(_currentUser);
        $rootScope.$broadcast('user.refresh.done', _currentUser);
      });

      return deferred.promise;
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
      _reloadNeeded = true;
      $cookieStore.remove('X-Authorization-Token');
      loginService.setAuthenticated(false);
    };

    /**
     * Retorna se o app está autenticado ou não
     * @returns {Boolean}
     */
    this.isAuthenticated = function(){
      return $cookieStore.get('X-Authorization-Token') ? true : false;
    };

    /**
     * Tenta autenticar o usuário informado
     * @param {Object} credentials
     * @returns {Promise}
     */
    this.doLogin = function(credentials) {

      var userDTO = {
        "profile":{
          "id": credentials.username
        },
        "credentials":{
          "password": credentials.password
        }
      };

      var promise = $http.post(portalResources.login, userDTO).then(function(response){
        _currentUser = response.data;
        $cookieStore.put('X-Authorization-Token', response.data.token);

        loginService.setAuthenticated(true);

        if ( _reloadNeeded ) {
          // TODO Fazer o retry dos requests, ao invés de dar um reload
          _reloadNeeded = false;
          $route.reload();
        }
      }, function(){
        loginService.setAuthenticated(false);
      });

      return promise;
    };

    $rootScope.$on('login.request_unathorized', function(){
      loginService.unauthenticate();
    });

    $rootScope.$on('user.refresh-current', function(){
      loginService.refreshCurrentUser();
    });

  });
});
