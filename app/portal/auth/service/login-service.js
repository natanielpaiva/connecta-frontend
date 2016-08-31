/* global angular */
define([
    'connecta.portal'
], function (portal) {
    return portal.service('LoginService', function (portalResources, $http, $rootScope,
            $cookieStore, $route, $q, $timeout, $heading, $base64) {

        var loginService = this;
        var _reloadNeeded = false;
        var _currentUser = null;
        var _userToken = {};

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
         * Seta o token da autenticação
         * @returns {String}
         */
        this.setAuthenticationToken = function (token) {
            return $cookieStore.get('portal.auth.access_token');
        };

        /**
         *
         * @returns {Object}
         */
        this.getCurrentUser = function () {
            var deferred = $q.defer();
            if (!_currentUser) {
                $http.get(portalResources.user + '/current').then(function (response) {
                    _currentUser = response.data;
                    deferred.resolve(_currentUser);
                }, function () {
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

            $http.get(portalResources.user + '/current').then(function (response) {
                _currentUser = response.data;
                var userCopy = {};
                angular.copy(_currentUser, userCopy);
                deferred.resolve(userCopy);
                $rootScope.$broadcast('user.refresh.done', userCopy);
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
            _userToken = {};
            _currentUser = null;
            _reloadNeeded = true;
            $cookieStore.remove('portal.auth.access_token');
            $cookieStore.remove('user.domain.name');
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
            var data = "username=" + user.email + "&password=" + user.password + "&grant_type=password&scope=read%20write&" +
                    "client_secret=secret&client_id=frontend";

            var deferred = $q.defer();

            $http.post(portalResources.login, data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "Authorization": "Basic " + $base64.encode("frontend" + ':' + "secret")
                }
            }).then(function (response) {
                _userToken.access_token = response.data.access_token;
                _userToken.refresh_token = response.data.refresh_token;
                $cookieStore.put('portal.auth.access_token', _userToken.access_token);
                $cookieStore.put('portal.auth.refresh_token', _userToken.refresh_token);
                deferred.resolve(response);
            }, function (response) {
                loginService.setAuthenticated(false);
                deferred.reject(response);
            });
            return deferred.promise;
        };

        this.selectDomain = function (domain) {
            $cookieStore.put('user.domain.name', domain.id);
            loginService.setAuthenticated(true);
        };
        this.setAuthenticatedUser = function (response) {
            _currentUser = response.data;

            loginService.setAuthenticated(true);

            if (_reloadNeeded) {
                // TODO Fazer o retry dos requests, ao invés de dar um reload
                _reloadNeeded = false;
//                $route.reload();
            }
        };

        $rootScope.$on('login.request_unathorized', function () {
            loginService.unauthenticate();
        });

        $rootScope.$on('user.refresh-current', function () {
            loginService.refreshCurrentUser();
        });

        this.hasSecurityRoles = function (requiredRoles) {
            var hasRole = false,
                    roleCheckPassed = false,
                    loweredRoles;
            if (_currentUser === undefined) {
                hasRole = false;
            } else if (_currentUser !== undefined && requiredRoles === undefined) {
                hasRole = true;
            } else if (_currentUser !== undefined && requiredRoles !== undefined) {
                if (requiredRoles.length === 0) {
                    hasRole = true;
                } else {
                    loweredRoles = [];
                    angular.forEach(_currentUser.roles, function (role) {
                        loweredRoles.push(role.name.toLowerCase());
                    });

                    // check user has at least one role in given required roles
                    angular.forEach(requiredRoles, function (role) {
                        roleCheckPassed = roleCheckPassed || loweredRoles.indexOf(role.toLowerCase()) > -1;
                    });

                    hasRole = roleCheckPassed;
                }
            }

            return hasRole;
        };

    });
});
