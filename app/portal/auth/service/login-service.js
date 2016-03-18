define([
    'connecta.portal'
], function (portal) {
    return portal.service('LoginService', function (portalResources, $http, $rootScope,
            $cookieStore, $route, $q, $timeout, $heading, $base64) {

        var loginService = this;
        var _reloadNeeded = false;
        var _currentUser = null;

        var _oauth = {
            clientId: 'frontend',
            clientSecret: 'secret'
        };

        /**
         * Atualiza o escopo da autenticação de acordo
         * com o retorno do método isAuthenticated()
         */
        this.checkAuthentication = function () {
            this.setAuthenticated(
                    this.isAuthenticated()
                    );
        };

        /**
         * Recupera o token da autenticação
         * @returns {String}
         */
        this.getAuthenticationToken = function () {
            return $cookieStore.get('portal.auth.access_token');
        };

        /**
         *
         * @returns {Object}
         */
        this.getCurrentUser = function () {
            var deferred = $q.defer();
            if (!_currentUser) {
                $http.get(portalResources.user + '/current', {
                    params: {
                        access_token: $cookieStore.get('portal.auth.access_token')
                    }
                }).then(function (response) {
                    console.log('CURRENT USER:', response);
                    _currentUser = response.data;
                    deferred.resolve(_currentUser);
                },function(response){
                    console.log(response);
                    loginService.unauthenticate();
                });
            } else {
                $timeout(function () {
                    var userCopy = {};
                    angular.copy(_currentUser, userCopy);
                    deferred.resolve(userCopy);
                });
            }

            return deferred.promise;
        };

        /**
         * Atualiza os dados do usuário
         */
        this.refreshCurrentUser = function () {
            var deferred = $q.defer();

            $http.get(portalResources.login + '/' + $cookieStore.get('portal.auth.access_token')).then(function (response) {
                _currentUser = response.data;
                var userCopy = {};
                angular.copy(_currentUser, userCopy);
                deferred.resolve(userCopy);
                $rootScope.$broadcast('user.refresh.done', userCopy);
            }, function (response){
                console.log(response);
            });

            return deferred.promise;
        };

        /**
         * Alerta o escopo do app se ele está autenticado ou não
         * @param {Boolean} authenticated
         */
        this.setAuthenticated = function (authenticated) {
            $rootScope.$broadcast('login.authenticated', authenticated);
        };

        /**
         * Remove o cookie guardado da autenticação
         * e alerta o escopo do app que falta autenticar
         */
        this.unauthenticate = function () {
            _reloadNeeded = true;
            $cookieStore.remove('portal.auth.access_token');
            loginService.setAuthenticated(false);
            $heading.clearLogo();
        };

        /**
         * Retorna se o app está autenticado ou não
         * @returns {Boolean}
         */
        this.isAuthenticated = function () {
            return $cookieStore.get('portal.auth.access_token') ? true : false;
        };

        /**
         * Tenta autenticar o usuário informado
         * 
         *  {
         "access_token": "c7b5bd57-9b05-4b6c-8b54-ac783846ef4b",
         "token_type": "bearer",
         "refresh_token": "43c06b0b-9028-42ba-9ff4-5ef856c68f29",
         "expires_in": 299,
         "scope": "read trust write"
         }
         * 
         * @param {Object} user
         * @returns {Promise}
         */
        this.doLogin = function (user) {


//            var data = "username=" + credentials.username + "&password="
//                    + credentials.password + "&grant_type=password&scope=read%20write&" +
//                    "client_secret=client_secret&client_id=frontend";
//            return $http.post('http://localhost:8080/connecta-portal/oauth/token', data, {
//                headers: {
//                    "Content-Type": "application/x-www-form-urlencoded",
//                    "Accept": "application/json",
//                    "Authorization": "Basic " + $base64.encode("frontend" + ':' + "secret")
//                }
//            }).success(function (response) {
//                return response;
//            });


//            //credentials.username credentials.password
//            var data = {
//                grant_type: 'password',
//                client_id: _oauth.clientId,
//                client_secret: _oauth.clientSecret,
//                username: user.username,
//                password: user.password
//            };

            var data = "username=" + user.username + "&password=" + user.password + "&grant_type=password&scope=read%20write&" +
                    "client_secret=secret&client_id=frontend";

            var deferred = $q.defer();

            $http.post(portalResources.login, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + $base64.encode("frontend" + ':' + "secret")
                }
               }).then(function (response) {
                   console.log(response);
                $cookieStore.put('portal.auth.access_token', response.data.access_token);
                $cookieStore.put('portal.auth.refresh_token', response.data.refresh_token);
                loginService.setAuthenticated(true);
//                loginService.getCurrentUser().then(loginService.setAuthenticatedUser);
                deferred.resolve(response);
                
            }, function (response) {
                console.log("batata");
                loginService.setAuthenticated(false);
                deferred.reject(response);
            });

            return deferred.promise;

        };

        this.setAuthenticatedUser = function (response) {
            _currentUser = response.data;

            loginService.setAuthenticated(true);

            if (_reloadNeeded) {
                // TODO Fazer o retry dos requests, ao invés de dar um reload
                _reloadNeeded = false;
                $route.reload();
            }
        };

        $rootScope.$on('login.request_unathorized', function () {
            loginService.unauthenticate();
        });

        $rootScope.$on('user.refresh-current', function () {
            loginService.refreshCurrentUser();
        });

    });
});
