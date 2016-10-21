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
            HeadingPopoverService, UserService, DomainService, DomainConfig, notify) {
        return {
            restrict: 'E',
            templateUrl: 'app/portal/layout/directive/template/heading.html',
            controller: function ($scope, applications, util, $route, $cookieStore, $configureDomain) {

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
                        $scope.toggleDomain = false;
                        var currentDomain = $cookieStore.get('user.domain.name');
                        identifyAndHighlightUserDomain(currentDomain);

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
                identifyAndHighlightUserDomain = function (domainSelected) {
                    for (var i = 0; i < $scope.user.domains.length; i++) {
                        if ($scope.user.domains[i].id === domainSelected) {
                            $scope.user.domains[i].selected = true;
                        } else {
                            $scope.user.domains[i].selected = false;
                        }
                    }
                };
                $scope.toggleDomainMenu = function ($event) {
//                    $scope.toggleDomain = !$scope.toggleDomain;
                    $event.stopPropagation();
                    $scope.inviteForm = true;
                };
                $scope.changeDomain = function (domain) {
                    if ($cookieStore.get('user.domain.name') !== domain.id) {
                        $cookieStore.put('user.domain.name', domain.id);
                        identifyAndHighlightUserDomain(domain.id);
                        reloadPageAfterDomainSelection();
                    }
                    $scope.toggleDomain = false;
                };

                $scope.configureDomain = function () {
                    DomainService.getParticipants($scope.domain.id).then(function (response) {
                        _getDomain();
                        $scope.domain.users = response.data;

                        $configureDomain('DOMAIN.CONFIGURE', $scope.domain);

                    });
                };

                $scope.inviteUser = function () {
                    DomainConfig.inviteUser($cookieStore.get('user.domain.name'), $scope.user.emails);
//                    $scope.toggleDomain = !$scope.toggleDomain;
                    $scope.user.emails = null;
                    $scope.inviteForm = false;

                };

                reloadPageAfterDomainSelection = function () {
                    $route.reload();
                };
            }
        };
    });
});
