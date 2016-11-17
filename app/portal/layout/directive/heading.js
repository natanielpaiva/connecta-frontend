define([
    'angular',
    'connecta.portal',
    'portal/auth/service/login-service',
    'portal/layout/service/layout',
    'portal/domain/service/domain-config',
    'portal/layout/service/util',
    'portal/layout/service/heading-popover-service',
    'portal/domain/service/configure-domain',
    'portal/layout/service/notify'
], function (angular, portal) {
    /**
     * Componente usado para renderizar e manter o header do portal
     */
    return portal.directive('heading', function (LayoutService, LoginService,
            HeadingPopoverService, UserService, DomainService, DomainConfig) {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/heading.html',
            controller: function ($scope, applications, util, $cookieStore, $configureDomain) {

                $scope.user = {};
                $scope.domain = {};
                $scope.avatarUrl = null;
                $scope.inviteForm = false;

                // adiciona a lista de aplicações no escopo
                $scope.applications = util.mapToArray(applications);
                var _getUser = function () {
                    LoginService.getCurrentUser().then(function (user) {
                        $scope.user = user;
                        $scope.getUserAvatarUrl();

                    });
                };
                var _getDomain = function () {
                    DomainService.getCurrentDomain().then(function (response) {
                        $scope.domain = response.data;
                    });

                };
                $scope.$on('login.authenticated', function ($event, isAuthenticated) {
                    if (isAuthenticated) {
                        _getUser();
                        _getDomain();

                    }
                });
                $scope.$on('user.update', function () {
                    _getUser();
                });
                LoginService.checkAuthentication();
                $scope.getUserAvatarUrl = function () {
                    $scope.avatarUrl = UserService.makeBackgroundImage($scope.user.id);
                };
                $scope.domainImage = function () {
                    return $scope.domain.name.toUpperCase()
                        .split(" ").map(function (word) {
                            return word[0];
                        }).join("").substring(0, 2);
                };
                $scope.logoutUser = function () {
                    LoginService.unauthenticate();
                };
                $scope.closePopOver = function () {
                    HeadingPopoverService.hide();
                };
                $scope.toggleAppsPopOver = function () {
                    $scope.appsPopoverFocus = true;
                    var popoverOptions = {
                        id: 'appsPopOver',
                        templateurl: 'heading-popover-apps.html',
                        controller: function ($scope) {
                            $scope.applications = util.mapToArray(applications);
                        },
                        close: function () {
                            $scope.appsPopoverFocus = false;
                        }
                    };
                    HeadingPopoverService.active(popoverOptions);
                };
                $scope.toggleDomainPopOver = function () {
                    $scope.domainPopoverFocus = true;
                    var popoverOptions = {
                        id: 'domainPopOver',
                        templateurl: 'heading-popover-domain.html',
                        controller: function ($scope) {
                            $scope.applications = util.mapToArray(applications);
                        },
                        close: function () {
                            $scope.domainPopoverFocus = false;
                        }
                    };
                    HeadingPopoverService.active(popoverOptions);
                };
                $scope.toggleUserPopOver = function () {
                    $scope.userPopoverFocus = true;
                    var popoverOptions = {
                        id: 'userPopOver',
                        templateurl: 'heading-popover-user.html',
                        controller: function ($scope) {
                            $scope.applications = util.mapToArray(applications);
                        },
                        close: function () {
                            $scope.userPopoverFocus = false;
                        }
                    };
                    HeadingPopoverService.active(popoverOptions);
                };
                $scope.toggleNotificationsPopOver = function () {
                    $scope.notificationPopoverFocus = true;
                    var popoverOptions = {
                        id: 'notificationsPopOver',
                        templateurl: 'heading-popover-notifications.html',
                        controller: function ($scope) {
                            $scope.notifications = [];
                        },
                        close: function () {
                            $scope.notificationPopoverFocus = false;
                        }
                    };
                    HeadingPopoverService.active(popoverOptions);
                };
                /**
                 * Oculta e exibe a barra lateral
                 *
                 * @returns {undefined}
                 */
                $scope.toggleSidebar = function () {
                    LayoutService.toggleSidebar();
                };
                $scope.shownModules = function (obj) {
                    return (!obj.hide && obj.active);
                };
                $scope.$on('heading.change-logo', function ($event, logoSrc) {
                    $scope.logoSrc = logoSrc + "?_=" + new Date().getTime();
                });
                $scope.$on('heading.remove-logo', function ($event, logoSrc) {
                    $scope.logoSrc = null;
                });
                $scope.$on('user.refresh.done', function ($event, user) {
                    $scope.user = user;
                    $scope.getUserAvatarUrl();
                });
                $scope.$on('layout.modulechange', function ($event, module) {
                    $scope.currentModule = module;
                });
                $scope.toggleDomainMenu = function ($event) {
                    $event.stopPropagation();
                    $scope.inviteForm = true;
                };

                $scope.configureDomain = function () {
                    DomainService.getParticipants($scope.domain.id).then(function (response) {
                        _getDomain();
                        $scope.domain.users = response.data;

                        $configureDomain('DOMAIN.CONFIGURE', $scope.domain).then(function () {
                            _getDomain();//Atualiza o domínio atual para o domínio salvo na modal.
                        });

                    });
                };

                $scope.inviteUser = function () {
                    DomainConfig.inviteUser($cookieStore.get('user.domain.name'), $scope.user.emails).then(function () {
                        $scope.inviteForm = false;
                    });
                    $scope.user.emails = null;

                };

            }
        };
    });
});
